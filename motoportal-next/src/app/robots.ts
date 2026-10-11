import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motoportal.com.tr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/hesabim", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
