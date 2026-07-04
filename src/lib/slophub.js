export {
  APPS_URL,
  RESERVED_ROUTES,
  fetchSlophubData,
  validateReservedRoutes,
} from "../App.jsx";

export function appPath(appId) {
  return `/${encodeURIComponent(appId)}`;
}

export function appCanonicalPath(app) {
  return appPath(app.app_id);
}

export function appImage(app) {
  return app.screenshots?.find((screenshot) => screenshot?.url)?.url ?? app.icon_url;
}

export function appJsonLd(app, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.title,
    description: app.description,
    applicationCategory: app.categories?.[0] ?? "SoftwareApplication",
    operatingSystem: "Linux",
    softwareVersion: app.release?.tag ?? app.release?.name,
    url: canonicalUrl,
    image: appImage(app),
  };
}
