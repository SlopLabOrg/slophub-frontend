import react from "@astrojs/react";
import { defineConfig } from "astro/config";

const publicSiteUrl = process.env.PUBLIC_SITE_URL ?? "https://slophub.org";
const siteUrl = new URL(publicSiteUrl);
const base = siteUrl.pathname === "/" ? undefined : siteUrl.pathname.replace(/\/$/, "");

export default defineConfig({
  output: "static",
  site: siteUrl.origin,
  base,
  integrations: [react()],
});
