export interface CapabilityItem {
  id: string;
  name: string;
  category: 'Gaming' | 'Streaming' | 'Work & Calls' | 'Browsing' | 'Heavy Downloads';
  minDownloadMbps: number;
  maxPingMs?: number;
  status: 'optimal' | 'adequate' | 'insufficient';
  description: string;
  iconName: string;
}

export function evaluateCapabilities(downloadMbps: number, pingMs: number): {
  tierName: string;
  tierSummary: string;
  gamingVerdict: string;
  capabilities: CapabilityItem[];
} {
  const isHighSpeed = downloadMbps >= 50;
  const isUltraFast = downloadMbps >= 100;
  const isLowPing = pingMs <= 25;
  const isMidPing = pingMs <= 60;

  let tierName = 'Broadband Starter';
  let tierSummary = 'Suitable for casual web browsing, messaging, and SD/HD video.';

  if (downloadMbps >= 250) {
    tierName = 'Gigabit Ultra-Fast';
    tierSummary = 'Blazing fast connection capable of multi-user 4K/8K streaming, instant game downloads, and pro streaming.';
  } else if (downloadMbps >= 100) {
    tierName = 'High-Speed Fiber';
    tierSummary = 'Excellent bandwidth for simultaneous 4K streams, seamless video conferences, and rapid cloud sync.';
  } else if (downloadMbps >= 50) {
    tierName = 'Standard High-Speed';
    tierSummary = 'Great for HD/4K streaming, smooth work calls, and multi-device household usage.';
  } else if (downloadMbps >= 25) {
    tierName = 'Moderate Broadband';
    tierSummary = 'Comfortable for 4K video on one screen, 1080p gaming, and steady daily work tasks.';
  } else if (downloadMbps >= 10) {
    tierName = 'Basic Broadband';
    tierSummary = 'Good for 1080p YouTube, Spotify, email, and social media feeds.';
  }

  // Gaming verdict specifically mentioning Free Fire and competitive games
  let gamingVerdict = '';
  if (isLowPing) {
    gamingVerdict = `Low Ping (${pingMs} ms): Optimal for competitive gaming like Free Fire, Valorant, BGMI, and CS. Zero jitter lag.`;
  } else if (isMidPing) {
    gamingVerdict = `Moderate Ping (${pingMs} ms): Playable for Free Fire, Roblox, and casual multiplayer. Slight delay in high-tick servers.`;
  } else {
    gamingVerdict = `High Ping (${pingMs} ms): May experience stutter or rubber-banding in competitive shooters like Free Fire. Recommended for turn-based or casual gaming.`;
  }

  const capabilities: CapabilityItem[] = [
    {
      id: 'competitive-gaming',
      name: 'Competitive Gaming (Free Fire, Valorant)',
      category: 'Gaming',
      minDownloadMbps: 10,
      maxPingMs: 35,
      status: (downloadMbps >= 10 && pingMs <= 35) ? 'optimal' : (downloadMbps >= 5 && pingMs <= 70) ? 'adequate' : 'insufficient',
      description: (pingMs <= 35) ? 'Ultra-low latency. Smooth bullet registration and minimal tick delay.' : 'Playable, but higher ping may cause occasional input lag.',
      iconName: 'Gamepad2'
    },
    {
      id: '4k-streaming',
      name: '4K UHD Video Streaming (YouTube, Netflix)',
      category: 'Streaming',
      minDownloadMbps: 25,
      status: downloadMbps >= 25 ? 'optimal' : downloadMbps >= 15 ? 'adequate' : 'insufficient',
      description: downloadMbps >= 25 ? 'Buffer-free 4K Ultra HD at 60 FPS with HDR enabled.' : '1080p HD works fine; 4K may need initial buffering.',
      iconName: 'Tv'
    },
    {
      id: 'video-calls',
      name: 'HD Video Calls (Zoom, Google Meet, Teams)',
      category: 'Work & Calls',
      minDownloadMbps: 5,
      maxPingMs: 80,
      status: (downloadMbps >= 5 && pingMs <= 80) ? 'optimal' : 'adequate',
      description: 'Crystal clear video and voice without choppy dropouts.',
      iconName: 'Video'
    },
    {
      id: 'large-downloads',
      name: 'Heavy File Downloads & Game Patches',
      category: 'Heavy Downloads',
      minDownloadMbps: 50,
      status: downloadMbps >= 100 ? 'optimal' : downloadMbps >= 35 ? 'adequate' : 'insufficient',
      description: downloadMbps >= 100 ? '10 GB game patch finishes in ~13 minutes.' : downloadMbps >= 25 ? 'Manageable download speeds; overnight for large games.' : 'Large downloads will take significant time.',
      iconName: 'DownloadCloud'
    },
    {
      id: 'web-browsing',
      name: 'Web Browsing, Music & Social Media',
      category: 'Browsing',
      minDownloadMbps: 3,
      status: downloadMbps >= 3 ? 'optimal' : 'adequate',
      description: 'Instant webpage loads, seamless social media feeds, and lossless audio streaming.',
      iconName: 'Globe'
    },
    {
      id: 'multi-device',
      name: 'Smart Home & Multi-Device Network',
      category: 'Work & Calls',
      minDownloadMbps: 30,
      status: downloadMbps >= 50 ? 'optimal' : downloadMbps >= 20 ? 'adequate' : 'insufficient',
      description: downloadMbps >= 50 ? 'Supports 8+ simultaneous devices without congestion.' : 'Supports 2-4 devices comfortably.',
      iconName: 'Smartphone'
    }
  ];

  return {
    tierName,
    tierSummary,
    gamingVerdict,
    capabilities
  };
}
