import type { MetadataRoute } from "next";
import { ROUTES } from "@/shared/config/routes";
import { RESOLVED_SITE_URL } from "@/shared/config/site";
import { getMoimDetailUrls } from "@/shared/seo/get-moim-detail-urls";

export const revalidate = 21600;

const STATIC_SITEMAP_ROUTES = [ROUTES.home, ROUTES.search] as const;

const buildSitemapUrl = (route: string) => {
  return new URL(route, RESOLVED_SITE_URL).toString();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_SITEMAP_ROUTES.map((route) => ({
    url: buildSitemapUrl(route),
  }));

  const meetingDetailEntries = (await getMoimDetailUrls()).map((url) => ({ url }));

  return [...staticEntries, ...meetingDetailEntries];
}
