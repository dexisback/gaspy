import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.16.73.117"],
  experimental: {
    turbopackMemoryLimit: 4 * 1024 * 1024 * 1024,
    turbopackFileSystemCacheForDev: false,
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
};

export default nextConfig;
