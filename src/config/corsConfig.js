// config/corsConfig.js - Final Optimized CORS Configuration for AgriVision System
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'http://localhost:5001',
    'https://yourproductiondomain.com',
    'https://staging.yourdomain.com', // Added support for staging environment
    'https://api.yourdomain.com', // API subdomain for external integrations
    'https://mobile.yourdomain.com', // Added support for mobile clients
    'https://partner.yourdomain.com', // Added partner integrations
    'https://iot.yourdomain.com', // Added IoT integrations
    'https://admin.yourdomain.com', // Added admin panel support
    'https://analytics.yourdomain.com' // Added analytics dashboard support
  ];
  
  const corsConfig = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(pattern => new RegExp(pattern).test(origin))) {
        callback(null, true);
      } else {
        console.error(`CORS rejection: ${origin} is not allowed`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added OPTIONS for explicit preflight requests
    allowedHeaders: [
      'Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 
      'X-Custom-Header', 'X-Device-ID', 'X-Session-ID', 'X-User-Role', 'X-Api-Version',
      'X-Forwarded-For', 'X-Real-IP', 'X-Client-Version', 'X-Platform', 'X-Timezone',
      'X-Security-Token', 'X-Environment', 'X-Admin-Access'
    ], // Expanded allowed headers for session tracking & API versioning
    exposedHeaders: [
      'Authorization', 'Content-Length', 'X-Correlation-ID', 'X-Trace-ID', 
      'X-Session-ID', 'X-User-Role', 'X-Api-Version', 'X-Client-Version'
    ], // Added X-Client-Version for client version tracking
    credentials: true, // Allows cookies & auth headers
    preflightContinue: false, // Ensures proper handling of preflight requests
    optionsSuccessStatus: 204, // Responds with 204 No Content for preflight requests
    maxAge: 86400, // Caches preflight response for 24 hours to reduce requests
    secure: true, // Enforce secure connections for production environments
    strictTransportSecurity: "max-age=31536000; includeSubDomains; preload", // Added HSTS for better security
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss://*; frame-ancestors 'none'; form-action 'self'; media-src 'self' data: blob:; font-src 'self' data:; object-src 'none';", // Strengthened CSP with object-src restriction
    referrerPolicy: "strict-origin-when-cross-origin", // Improved security for cross-origin requests
    featurePolicy: "geolocation 'self'; microphone 'none'; camera 'none'; payment 'none'; fullscreen 'self'; usb 'none'; vr 'none'; accelerometer 'none'; gyroscope 'none'; autoplay 'none'; clipboard-read 'self'; clipboard-write 'self'; cross-origin-isolated 'none';", // Extended Feature Policy with cross-origin isolation restriction
    permissionsPolicy: "geolocation=(self), microphone=(), camera=(), payment=(), fullscreen=(self), usb=(), vr=(), accelerometer=(), gyroscope=(), autoplay=(), clipboard-read=(self), clipboard-write=(self), cross-origin-isolated=()", // Added modern Permissions Policy for better security
    crossOriginResourcePolicy: "same-origin", // Prevents cross-origin resource sharing unless explicitly allowed
    crossOriginOpenerPolicy: "same-origin-allow-popups", // Mitigates cross-origin attacks while allowing safe pop-ups
    crossOriginEmbedderPolicy: "require-corp", // Prevents embedding of untrusted third-party resources
    reportOnly: false, // Added option for CSP report-only mode for debugging
    enforceHttpsRedirect: true, // Ensures all traffic is redirected to HTTPS for security
    httpOnlyCookies: true, // Ensures cookies are only accessible via HTTP(S) for added security
    secureCookies: true, // Forces cookies to be transmitted over secure connections
    disableCorsForInternalAPIs: false, // Allow disabling CORS for internal microservices if needed
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes window
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later'
    }, // Added rate limiting to prevent abuse
  };
  
  module.exports = corsConfig;
  