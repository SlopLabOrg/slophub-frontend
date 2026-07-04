export const prerender = true;

export function GET({ site }) {
  const baseUrl = new URL(process.env.PUBLIC_SITE_URL ?? site ?? "https://slophub.org");
  const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.replace(/\/$/, "");
  const sitemapUrl = new URL(`${basePath}/sitemap.xml`, baseUrl.origin).toString();

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
