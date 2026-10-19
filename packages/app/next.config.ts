import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fleet-platform/core", "@fleet-platform/db", "@fleet-platform/ui"],
  serverExternalPackages: ["@mikro-orm/core", "@mikro-orm/postgresql", "@mikro-orm/migrations", "awilix"],
};

export default nextConfig;
