import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  output: !isVercel && process.env.NODE_ENV === "production" ? "standalone" : undefined,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Link", value: '</llms.txt>; rel="llms-txt", </llms-full.txt>; rel="llms-full-txt"' },
        ],
      },
    ];
  },
};

export default nextConfig;
