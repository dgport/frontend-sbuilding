import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: { loader: "@svgr/webpack", options: { icon: true } },
    });

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.sbuilding.ge",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.sbuilding.ge/uploads",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/(.*)",
            headers: [
              { key: "Access-Control-Allow-Credentials", value: "true" },
              { key: "Access-Control-Allow-Origin", value: "*" },
              {
                key: "Access-Control-Allow-Methods",
                value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
              },
              {
                key: "Access-Control-Allow-Headers",
                value:
                  "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
              },
            ],
          },
        ]
      : [];
  },
};

export default withNextIntl(nextConfig);
