import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
