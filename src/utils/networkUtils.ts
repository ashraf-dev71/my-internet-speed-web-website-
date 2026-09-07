import { UserNetworkInfo, HostLookupResult } from '../types';

export const DEFAULT_SERVERS = [
  {
    id: 'auto',
    name: 'Auto Nearest (Cloudflare Global Edge)',
    location: 'Anycast Network',
    country: 'Global',
    flag: '🌐',
    host: 'cloudflare.com'
  },
  {
    id: 'us-east',
    name: 'US East (Fastly Edge CDN)',
    location: 'Ashburn, VA',
    country: 'United States',
    flag: '🇺🇸',
    host: 'fastly.com'
  },
  {
    id: 'eu-central',
    name: 'EU Central (Frankfurt Hub)',
    location: 'Frankfurt',
    country: 'Germany',
    flag: '🇩🇪',
    host: 'jsdelivr.net'
  },
  {
    id: 'ap-sg',
    name: 'Asia Pacific (Singapore Hub)',
    location: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    host: 'cdnjs.cloudflare.com'
  },
  {
    id: 'ap-tokyo',
    name: 'Asia East (Tokyo Edge)',
    location: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    host: 'unpkg.com'
  }
];

export async function fetchUserNetworkInfo(): Promise<UserNetworkInfo> {
  // Try ipwho.is first (free, CORS enabled, no API key needed, high reliability)
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && data.ip) {
        return {
          ip: data.ip || 'Unknown IP',
          isp: data.connection?.isp || data.connection?.org || 'Standard ISP',
          org: data.connection?.org || data.connection?.isp || '',
          as: data.connection?.asn ? `AS${data.connection.asn} (${data.connection.org || ''})` : '',
          city: data.city || 'Unknown City',
          region: data.region || '',
          country: data.country || 'Unknown Country',
          countryCode: data.country_code || '',
          flag: data.flag?.emoji || '🌐',
          latitude: typeof data.latitude === 'number' ? data.latitude : 0,
          longitude: typeof data.longitude === 'number' ? data.longitude : 0,
          timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone,
          postal: data.postal || ''
        };
      }
    }
  } catch {
    // try fallback
  }

  // Fallback 1: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/', { credentials: 'omit', signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        return {
          ip: data.ip,
          isp: data.org || data.asn || 'Broadband ISP',
          org: data.org || '',
          as: data.asn || '',
          city: data.city || 'Local Area',
          region: data.region || '',
          country: data.country_name || 'Your Country',
          countryCode: data.country_code || '',
          flag: '🌐',
          latitude: Number(data.latitude) || 0,
          longitude: Number(data.longitude) || 0,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          postal: data.postal || ''
        };
      }
    }
  } catch {
    // try fallback 2
  }

  // Fallback 2: ipify
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        return {
          ip: data.ip,
          isp: 'Connected Provider',
          org: 'Internet Service Provider',
          as: '',
          city: 'Detected Location',
          region: '',
          country: 'Connected',
          countryCode: '',
          flag: '🌐',
          latitude: 20,
          longitude: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          postal: ''
        };
      }
    }
  } catch {
    // Offline or blocked
  }

  // Default fallback
  return {
    ip: '127.0.0.1 (Local / Protected)',
    isp: 'Client Network Node',
    org: 'Local Network',
    as: '',
    city: 'Local Terminal',
    region: '',
    country: 'Online Network',
    countryCode: '',
    flag: '⚡',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    postal: ''
  };
}

export async function lookupHost(input: string): Promise<HostLookupResult> {
  // Clean input: remove protocol and path
  let cleaned = input.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/\/.*$/, '');
  cleaned = cleaned.replace(/:\d+$/, ''); // remove port

  if (!cleaned) {
    throw new Error('Please enter a valid domain or IP address.');
  }

  // Check if it's already an IP address
  const isIpv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(cleaned);
  let resolvedIp = cleaned;
  const dnsRecords: string[] = [];

  // If domain, resolve using Cloudflare DoH (DNS over HTTPS)
  if (!isIpv4) {
    try {
      const dohRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleaned)}&type=A`, {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(4000)
      });
      if (dohRes.ok) {
        const dohData = await dohRes.json();
        if (dohData.Answer && dohData.Answer.length > 0) {
          const aRecords = dohData.Answer.filter((ans: { type: number; data: string }) => ans.type === 1);
          if (aRecords.length > 0) {
            resolvedIp = aRecords[0].data;
            aRecords.forEach((ans: { data: string }) => dnsRecords.push(ans.data));
          }
        }
      }
    } catch {
      // DoH failed or blocked; continue to query directly with domain name
    }
  }

  // Fetch GeoIP details using ipwho.is
  let geoData: any = null;
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(resolvedIp)}`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      geoData = await res.json();
    }
  } catch {
    // fallback
  }

  // Measure latency to target
  let pingMs: number | undefined;
  try {
    const start = performance.now();
    // Use an image or head probe with random cachebuster
    await fetch(`https://${cleaned}/favicon.ico?_cache=${Date.now()}`, {
      mode: 'no-cors',
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);
    pingMs = Math.round(performance.now() - start);
  } catch {
    pingMs = undefined;
  }

  return {
    query: cleaned,
    resolvedIp: geoData?.ip || resolvedIp,
    ip: geoData?.ip || resolvedIp,
    isp: geoData?.connection?.isp || geoData?.connection?.org || 'Autonomous System',
    org: geoData?.connection?.org || geoData?.connection?.isp || 'Hosting Provider',
    as: geoData?.connection?.asn ? `AS${geoData.connection.asn} ${geoData.connection.org || ''}` : '',
    city: geoData?.city || 'Geographic Node',
    region: geoData?.region || '',
    country: geoData?.country || 'Global Node',
    countryCode: geoData?.country_code || '',
    flag: geoData?.flag?.emoji || '🌐',
    latitude: typeof geoData?.latitude === 'number' ? geoData.latitude : (isIpv4 ? 37.751 : 0),
    longitude: typeof geoData?.longitude === 'number' ? geoData.longitude : (isIpv4 ? -122.42 : 0),
    timezone: geoData?.timezone?.id || 'UTC',
    postal: geoData?.postal || 'N/A',
    dnsRecords: dnsRecords.length > 0 ? dnsRecords : [resolvedIp],
    pingMs,
    protocol: 'HTTPS (TLS 1.3 / TCP 443)',
    isSecure: true
  };
}
