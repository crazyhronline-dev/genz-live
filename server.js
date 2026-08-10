const path = require('path');
const http = require('http');

const dir = path.join(__dirname);

process.env.NODE_ENV = 'production';
process.chdir(__dirname);

const currentPort = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10);
if (
  Number.isNaN(keepAliveTimeout) ||
  !Number.isFinite(keepAliveTimeout) ||
  keepAliveTimeout < 0
) {
  keepAliveTimeout = undefined;
}

const { startServer } = require('next/dist/server/lib/start-server');

// ─── Self-ping keepalive ──────────────────────────────────────────────────────
// Hostinger Passenger kills idle Node processes after ~5 minutes.
// This pings the health endpoint every 4 minutes to keep the process alive.
const PING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

function selfPing() {
  const pingPort = currentPort;
  const req = http.get(
    { hostname: '127.0.0.1', port: pingPort, path: '/api/health', timeout: 10000 },
    (res) => {
      // Consume response to free socket
      res.resume();
    }
  );
  req.on('error', () => {
    // Silently ignore — server may still be starting
  });
  req.end();
}

// Start pinging after a 30s grace period (allow server to fully boot first)
setTimeout(() => {
  selfPing(); // immediate first ping
  setInterval(selfPing, PING_INTERVAL_MS);
}, 30 * 1000);

// ─── Automated Cache Purge ──────────────────────────────────────────────────
// Automatically purges .next/cache every 15 minutes to guarantee fresh content
const CACHE_PURGE_INTERVAL_MS = 15 * 60 * 1000;
function autoCleanCache() {
  try {
    const fs = require('fs');
    const cachePath = path.join(dir, '.next', 'cache');
    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true });
    }
  } catch (e) {
    // Silently ignore filesystem lock exceptions
  }
}
setTimeout(() => {
  autoCleanCache();
  setInterval(autoCleanCache, CACHE_PURGE_INTERVAL_MS);
}, 60 * 1000);

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  process.exit(0);
});
process.on('SIGINT', () => {
  process.exit(0);
});

// ─── Boot Next.js server ──────────────────────────────────────────────────────
startServer({
  dir,
  isDev: false,
  hostname,
  port: currentPort,
  allowRetry: false,
  keepAliveTimeout,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
