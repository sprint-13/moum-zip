import type { MetadataRoute } from "next";
import { RESOLVED_SITE_URL } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/oauth/", "/mypage", "/spaces", "/moim-create", "/moim-edit"],
    },
    sitemap: new URL("/sitemap.xml", RESOLVED_SITE_URL).toString(),
  };
}
