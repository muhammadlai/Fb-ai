import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `pg` pulls in optional native/CJS-only bits (pg-native, cloudflare sockets
  // shim). Keeping it external stops the bundler from trying to statically
  // resolve them at build time.
  serverExternalPackages: ["pg", "pg-cloudflare"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
    ],
  },

};

export default nextConfig;

// Makes Cloudflare bindings (env, ctx, cf) available while running `next dev`.
// Guarded so it never runs during `next build` / inside the Workers runtime.
if (process.env.NODE_ENV === "development") {
  void import("@opennextjs/cloudflare")
    .then(({ initOpenNextCloudflareForDev }) => initOpenNextCloudflareForDev())
    .catch(() => {
      // Adapter not installed / not needed - plain `next dev` still works.
    });
}
