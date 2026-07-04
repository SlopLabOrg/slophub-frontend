import { appCanonicalPath, fetchSlophubData } from "../lib/slophub.js";

export const prerender = true;

export async function GET({ site }) {
  const data = await fetchSlophubData();
  const baseUrl = new URL(process.env.PUBLIC_SITE_URL ?? site ?? "https://slophub.org");
  const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.replace(/\/$/, "");
  const urls = ["/", "/docs", ...data.apps.map(appCanonicalPath)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${new URL(`${basePath}${path}`, baseUrl.origin).toString()}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
