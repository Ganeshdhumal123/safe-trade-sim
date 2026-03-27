// Generate a deterministic device ID based on browser/OS information
export function generateDeviceId(): string {
  const nav = navigator;
  const screen = window.screen;

  const raw = [
    nav.userAgent,
    nav.language,
    nav.hardwareConcurrency?.toString() || "unknown",
    nav.platform || "unknown",
    `${screen.width}x${screen.height}`,
    screen.colorDepth?.toString() || "unknown",
    Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
  ].join("|");

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }

  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `DEV-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

export function getDeviceInfo(): { os: string; browser: string; screen: string; platform: string } {
  const ua = navigator.userAgent;

  let os = "Unknown OS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let browser = "Unknown Browser";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  return {
    os,
    browser,
    screen: `${window.screen.width}x${window.screen.height}`,
    platform: navigator.platform || "Unknown",
  };
}
