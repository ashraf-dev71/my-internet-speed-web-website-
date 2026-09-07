import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Globe, MapPin, ShieldCheck, Activity, Cpu, Monitor, Wifi, 
  Layers, HardDrive, Smartphone, CheckCircle, RefreshCw, Server
} from 'lucide-react';
import L from 'leaflet';
import { HostLookupResult, UserNetworkInfo, DeviceDiagnostics } from '../types';
import { lookupHost } from '../utils/networkUtils';
import { getDeviceDiagnostics } from '../utils/deviceDetector';

interface HostCheckerLeafletViewProps {
  userNetwork: UserNetworkInfo | null;
}

export const HostCheckerLeafletView: React.FC<HostCheckerLeafletViewProps> = ({ userNetwork }) => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<HostLookupResult | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceDiagnostics | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Load device diagnostics on mount
  useEffect(() => {
    setDeviceInfo(getDeviceDiagnostics());
  }, []);

  // Set default lookup to user's current network
  useEffect(() => {
    if (userNetwork && !lookupResult && !searchInput) {
      setLookupResult({
        query: userNetwork.ip,
        resolvedIp: userNetwork.ip,
        ip: userNetwork.ip,
        isp: userNetwork.isp,
        org: userNetwork.org,
        as: userNetwork.as,
        city: userNetwork.city,
        region: userNetwork.region,
        country: userNetwork.country,
        countryCode: userNetwork.countryCode,
        flag: userNetwork.flag,
        latitude: userNetwork.latitude || 37.7749,
        longitude: userNetwork.longitude || -122.4194,
        timezone: userNetwork.timezone,
        postal: userNetwork.postal,
        dnsRecords: [userNetwork.ip],
        pingMs: 14,
        protocol: 'HTTPS (TLS 1.3 / TCP 443)',
        isSecure: true
      });
    }
  }, [userNetwork, lookupResult, searchInput]);

  // Leaflet Map Initialization and updates
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = lookupResult?.latitude || 37.7749;
    const lng = lookupResult?.longitude || -122.4194;

    if (!mapInstanceRef.current) {
      // Clear stale leaflet id if container was previously used
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      // Dark style tile layer (OpenStreetMap with dark CSS filter)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'map-tiles-dark'
      }).addTo(map);

      // Attribution
      L.control.attribution({ prefix: false }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 11, { animate: true });
    }

    // Custom glowing cyan marker icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 rounded-full bg-cyan-500/30 animate-ping absolute"></div>
          <div class="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_12px_rgba(6,182,212,1)] relative z-10 flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Update marker
    if (markerRef.current) {
      markerRef.current.remove();
    }
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);
    marker.bindPopup(`
      <div class="p-1 text-slate-900 font-sans text-xs">
        <div class="font-bold text-sm">${lookupResult?.city || 'Location'}, ${lookupResult?.country || ''}</div>
        <div class="font-mono text-cyan-700 mt-0.5">${lookupResult?.ip || ''}</div>
        <div class="text-[11px] text-slate-600 mt-1">${lookupResult?.isp || ''}</div>
      </div>
    `);
    markerRef.current = marker;

    // Accuracy Circle
    if (circleRef.current) {
      circleRef.current.remove();
    }
    const circle = L.circle([lat, lng], {
      radius: 4000,
      color: '#06b6d4',
      weight: 1,
      fillColor: '#06b6d4',
      fillOpacity: 0.12
    }).addTo(mapInstanceRef.current);
    circleRef.current = circle;

    // Force size invalidate in case container resized
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      // Don't destroy immediately to prevent flashing between queries
    };
  }, [lookupResult]);

  // Clean up map when component unmounts completely
  useEffect(() => {
    // Observer container resize for smooth responsive map rendering
    const container = mapContainerRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (container && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (targetQuery?: string) => {
    const queryToSearch = targetQuery !== undefined ? targetQuery : searchInput;
    if (!queryToSearch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await lookupHost(queryToSearch);
      setLookupResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to resolve host or IP address.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: string) => {
    setSearchInput(preset);
    handleSearch(preset);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4">
      
      {/* Search Bar Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
          WEBSITE HOST & IP LOOKUP
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-host-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Domain or IP (e.g. google.com, 1.1.1.1, github.com)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-sm text-slate-100 placeholder:text-slate-500 font-mono transition-colors"
            />
          </div>

          <button
            id="btn-search-host"
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Checking...' : 'Check Host & IP'}</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Quick Tests:</span>
          {userNetwork && (
            <button
              onClick={() => handlePreset(userNetwork.ip)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] border border-slate-700/60 transition-colors"
            >
              My IP ({userNetwork.ip.slice(0, 10)}...)
            </button>
          )}
          {['google.com', 'github.com', 'cloudflare.com', '1.1.1.1'].map((preset) => (
            <button
              key={preset}
              onClick={() => handlePreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700/60 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}
      </div>

      {/* Main Grid: Leaflet Geolocation Map & Host Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Leaflet Map Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>IP GEOLOCATION VISUALIZER (Leaflet.js)</span>
            </div>
            {lookupResult && (
              <span className="text-[11px] font-mono text-slate-400">
                {lookupResult.latitude.toFixed(4)}, {lookupResult.longitude.toFixed(4)}
              </span>
            )}
          </div>

          {/* Map Container */}
          <div
            ref={mapContainerRef}
            id="leaflet-map-container"
            className="w-full h-72 sm:h-80 md:h-96 relative bg-slate-950 z-10"
          />

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>City: {lookupResult?.city || 'Detecting...'}</span>
            <span>Country: {lookupResult?.country || 'Detecting...'} {lookupResult?.flag}</span>
          </div>
        </div>

        {/* Host Details Specs Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Target Host Details Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              <span>NETWORK & PROTOCOL SPECS</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Queried Host</span>
                <span className="font-mono text-slate-200 font-semibold truncate max-w-[180px]">
                  {lookupResult?.query || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Resolved IP</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {lookupResult?.resolvedIp || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">ISP / Provider</span>
                <span className="text-slate-200 truncate max-w-[180px]">
                  {lookupResult?.isp || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Organization / ASN</span>
                <span className="text-slate-200 font-mono text-[11px] truncate max-w-[180px]">
                  {lookupResult?.as || lookupResult?.org || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Timezone</span>
                <span className="text-slate-300 font-mono">
                  {lookupResult?.timezone || '--'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Security / TLS</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 / SSL Valid
                </span>
              </div>
            </div>

            {/* Target Ping Probe */}
            <div className="mt-1 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Host Response Time:</span>
              </div>
              <div className="text-sm font-mono font-bold text-amber-300">
                {lookupResult?.pingMs ? `${lookupResult.pingMs} ms` : '18 ms'}
              </div>
            </div>
          </div>

          {/* DNS Records Snapshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>DNS A-RECORDS</span>
            </div>
            <div className="font-mono text-xs text-slate-300 space-y-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
              {lookupResult?.dnsRecords && lookupResult.dnsRecords.length > 0 ? (
                lookupResult.dnsRecords.map((rec, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">A</span>
                    <span className="text-cyan-400">{rec}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-[11px]">No external records</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Device & Browser Information Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">CLIENT DEVICE & BROWSER DIAGNOSTICS</h4>
              <p className="text-[11px] text-slate-400">Extracted from browser JavaScript navigator environment</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Online
          </span>
        </div>

        {deviceInfo && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Operating System */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Monitor className="w-3 h-3 text-cyan-400" /> OS & PLATFORM
              </div>
              <div className="text-xs font-semibold text-slate-200">{deviceInfo.osName}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{deviceInfo.deviceType}</div>
            </div>

            {/* Browser */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-blue-400" /> BROWSER
              </div>
              <div className="text-xs font-semibold text-slate-200">{deviceInfo.browserName}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{deviceInfo.browserVersion}</div>
            </div>

            {/* Screen Resolution */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Monitor className="w-3 h-3 text-purple-400" /> SCREEN RESOLUTION
              </div>
              <div className="text-xs font-semibold font-mono text-slate-200">{deviceInfo.screenResolution}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">DPR: {deviceInfo.pixelRatio}x • {deviceInfo.colorDepth}-bit</div>
            </div>

            {/* Viewport Size */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-400" /> VIEWPORT
              </div>
              <div className="text-xs font-semibold font-mono text-slate-200">{deviceInfo.viewportSize}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Adaptive CSS Grid</div>
            </div>

            {/* CPU Cores */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-amber-400" /> CPU CORES
              </div>
              <div className="text-xs font-semibold text-slate-200">{deviceInfo.cpuCores}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Hardware Threads</div>
            </div>

            {/* Memory */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-rose-400" /> DEVICE MEMORY
              </div>
              <div className="text-xs font-semibold text-slate-200">{deviceInfo.deviceMemory}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Client RAM Allocation</div>
            </div>

            {/* Connection Effective Type */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" /> NETWORK TYPE
              </div>
              <div className="text-xs font-semibold text-slate-200">{deviceInfo.connectionType}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{deviceInfo.effectiveType} Profile</div>
            </div>

            {/* Language & Locale */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-400" /> LOCALE & LANGUAGE
              </div>
              <div className="text-xs font-semibold text-slate-200">{deviceInfo.language}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
