import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    runtimeCaching: [
      { urlPattern: /^https?:.*\/api\/.*/i, handler: "NetworkOnly", options: { cacheName: "api-never-cache" } },
      { urlPattern: /^https?:.*\/_next\/static\/.*/i, handler: "CacheFirst", options: { cacheName: "next-static" } },
      { urlPattern: /^https?:.*\/.*/i, handler: "NetworkFirst", options: { cacheName: "pages" } }
    ]
  }
});

export default withPWA({ reactStrictMode: true });
