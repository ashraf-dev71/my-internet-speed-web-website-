import { DeviceDiagnostics } from '../types';

export function getDeviceDiagnostics(): DeviceDiagnostics {
  const ua = navigator.userAgent || '';
  const screen = window.screen;

  // Browser detection
  let browserName = 'Unknown Browser';
  let browserVersion = '';

  if (/edg\/([0-9.]+)/i.test(ua)) {
    browserName = 'Microsoft Edge';
    browserVersion = ua.match(/edg\/([0-9.]+)/i)?.[1] || '';
  } else if (/opr\/([0-9.]+)/i.test(ua) || /opera/i.test(ua)) {
    browserName = 'Opera';
    browserVersion = ua.match(/opr\/([0-9.]+)/i)?.[1] || '';
  } else if (/chrome|crios/i.test(ua)) {
    browserName = 'Google Chrome';
    browserVersion = ua.match(/(?:chrome|crios)\/([0-9.]+)/i)?.[1] || '';
  } else if (/firefox|fxios/i.test(ua)) {
    browserName = 'Mozilla Firefox';
    browserVersion = ua.match(/(?:firefox|fxios)\/([0-9.]+)/i)?.[1] || '';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browserName = 'Apple Safari';
    browserVersion = ua.match(/version\/([0-9.]+)/i)?.[1] || '';
  }

  // OS detection
  let osName = 'Unknown OS';
  let osVersion = '';

  if (/windows nt 10.0/i.test(ua)) {
    osName = 'Windows 10/11';
  } else if (/windows nt 6.3/i.test(ua)) {
    osName = 'Windows 8.1';
  } else if (/windows nt 6.1/i.test(ua)) {
    osName = 'Windows 7';
  } else if (/mac os x ([0-9._]+)/i.test(ua)) {
    osName = 'macOS';
    osVersion = (ua.match(/mac os x ([0-9._]+)/i)?.[1] || '').replace(/_/g, '.');
  } else if (/android ([0-9.]+)/i.test(ua)) {
    osName = 'Android';
    osVersion = ua.match(/android ([0-9.]+)/i)?.[1] || '';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    osName = 'iOS';
    osVersion = (ua.match(/os ([0-9_]+)/i)?.[1] || '').replace(/_/g, '.');
  } else if (/linux/i.test(ua)) {
    osName = 'Linux';
  } else if (/cros/i.test(ua)) {
    osName = 'ChromeOS';
  }

  // Device Type
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // Network Connection API
  const navAny = navigator as any;
  const connection = navAny.connection || navAny.mozConnection || navAny.webkitConnection;

  return {
    browserName,
    browserVersion: browserVersion ? `v${browserVersion.split('.')[0]}` : '',
    osName: osVersion ? `${osName} ${osVersion}` : osName,
    osVersion,
    deviceType,
    screenResolution: `${screen.width} × ${screen.height}`,
    viewportSize: `${window.innerWidth} × ${window.innerHeight}`,
    pixelRatio: Math.round((window.devicePixelRatio || 1) * 10) / 10,
    colorDepth: screen.colorDepth || 24,
    cpuCores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : '4+ Cores',
    deviceMemory: navAny.deviceMemory ? `~${navAny.deviceMemory} GB` : 'Standard',
    connectionType: connection?.type || 'Wi-Fi / Ethernet',
    effectiveType: connection?.effectiveType ? connection.effectiveType.toUpperCase() : '4G / Broadband',
    downlink: connection?.downlink ? `${connection.downlink} Mbps` : 'High Speed',
    rtt: connection?.rtt ? `${connection.rtt} ms` : 'Low Latency',
    online: navigator.onLine,
    language: navigator.language || 'en-US',
    userAgent: ua
  };
}
