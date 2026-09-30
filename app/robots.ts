import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["ClaudeBot", "anthropic-ai", "Claude-Web", "Amazonbot"],
        allow: "/",
        disallow: "",
      },
    ],
    sitemap: "https://pixel-for-good.vercel.app/sitemap.xml",
  };
}