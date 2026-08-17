import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/association",
    "/board",
    "/documents",
    "/architectural-review",
    "/amenities",
    "/calendar",
    "/news",
    "/faq",
    "/contact",
    "/budget",
  ];

  return paths.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }));
}
