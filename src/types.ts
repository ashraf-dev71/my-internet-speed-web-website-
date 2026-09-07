export type SpeedTestStage = 'idle' | 'ping' | 'download' | 'upload' | 'completed';

export interface SpeedTestMetrics {
  ping: number; // ms
  jitter: number; // ms
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  bytesDownloaded: number; // Bytes
  bytesUploaded: number; // Bytes
  progress: number; // 0 - 100%
}

export interface SpeedTestResult {
  id: string;
  timestamp: number;
  dateStr: string;
  ping: number;
  jitter: number;
  downloadSpeed: number;
  uploadSpeed: number;
  serverName: string;
  serverLocation: string;
  ip: string;
  isp: string;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ServerOption {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  host: string;
}

export interface UserNetworkInfo {
  ip: string;
  isp: string;
  org: string;
  as: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  latitude: number;
  longitude: number;
  timezone: string;
  postal: string;
}

export interface HostLookupResult extends UserNetworkInfo {
  query: string;
  resolvedIp: string;
  dnsRecords?: string[];
  pingMs?: number;
  protocol: string;
  isSecure: boolean;
  httpStatus?: number;
}

export interface DeviceDiagnostics {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  screenResolution: string;
  viewportSize: string;
  pixelRatio: number;
  colorDepth: number;
  cpuCores: number | string;
  deviceMemory: number | string;
  connectionType: string;
  effectiveType: string;
  downlink: number | string;
  rtt: number | string;
  online: boolean;
  language: string;
  userAgent: string;
}

export type ActiveTab = 'speedtest' | 'history' | 'hostchecker' | 'creator' | 'privacy' | 'github-guide';
