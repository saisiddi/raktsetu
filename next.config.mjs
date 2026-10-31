/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

// Content Security Policy (CSP) directives:
// - default-src 'self': Restrict resource loading to same-origin by default.
// - script-src 'self' 'unsafe-inline' (plus 'unsafe-eval' in development):
//     - 'self': Allows loading first-party Next.js scripts, chunks, and bundles from the same origin.
//     - 'unsafe-inline': Required for Next.js inline scripts (React Server Component streaming, state hydration, and page bootstrap).
//     - 'unsafe-eval': Only allowed in development for React Fast Refresh and dev source maps.
// - style-src 'self' 'unsafe-inline':
//     - 'self': Allows loading first-party stylesheets (compiled Tailwind CSS).
//     - 'unsafe-inline': Required for Leaflet dynamically setting inline style properties on map elements/panes and Next.js inline styles.
// - img-src 'self' blob: data: https://tile.openstreetmap.org https://*.tile.openstreetmap.org:
//     - 'self': Allows first-party image assets (favicons, OpenGraph images, static icons).
//     - blob: / data:: Allows Leaflet marker icons, marker shadows, and inline base64/blob image assets.
//     - https://tile.openstreetmap.org & https://*.tile.openstreetmap.org: Allows fetching OpenStreetMap map tiles via Leaflet TileLayer.
// - font-src 'self':
//     - 'self': Allows loading local and self-hosted fonts (Geist and Geist Mono optimized by next/font).
// - connect-src 'self' https://tile.openstreetmap.org https://*.tile.openstreetmap.org (plus ws: wss: in development):
//     - 'self': Allows Next.js client-side navigation, prefetching, and data requests.
//     - https://tile.openstreetmap.org & https://*.tile.openstreetmap.org: Allows OpenStreetMap tile requests and potential CORS tile checks.
//     - ws: / wss:: Allowed only in development mode for Turbopack / Next.js Fast Refresh HMR WebSocket.
// - object-src 'none': Blocks browser plugin execution (Flash, Java, etc.).
// - base-uri 'self': Prevents unauthorized modification of the document base URI.
// - form-action 'self': Ensures form submissions can only target the same origin.
// - frame-ancestors 'none': Blocks embedding the site in iframes (anti-clickjacking protection).
// - upgrade-insecure-requests: Upgrades all HTTP requests to HTTPS in production environments.
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://tile.openstreetmap.org https://*.tile.openstreetmap.org",
  "font-src 'self'",
  `connect-src 'self' https://tile.openstreetmap.org https://*.tile.openstreetmap.org${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
];

const contentSecurityPolicy = cspDirectives.join("; ");

const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
