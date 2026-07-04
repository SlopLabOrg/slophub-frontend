import { useEffect, useMemo, useState } from "react";
import { I18nProvider, useI18n } from "./i18n";

export const APPS_URL = "https://dl.sloplab.org/apps.json";

export const RESERVED_ROUTES = new Set([
  "404",
  "404.html",
  "about",
  "apps",
  "assets",
  "categories",
  "docs",
  "favicon.ico",
  "faq",
  "privacy",
  "robots.txt",
  "sitemap.xml",
  "terms",
]);

const CATEGORY_KEYS = [
  "Audio",
  "AudioVideo",
  "Database",
  "Development",
  "Education",
  "Game",
  "Graphics",
  "IDE",
  "Network",
  "Office",
  "Science",
  "Settings",
  "Spreadsheet",
  "System",
  "Utility",
  "Video",
];

function routePath(path) {
  const baseUrl = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return `${normalizedBase}${path}` || "/";
}

function appRoute(appId) {
  return routePath(`/${encodeURIComponent(appId)}`);
}

const CATEGORY_EMOJIS = {
  Audio: "🎧",
  AudioVideo: "🎬",
  Database: "🗄️",
  Development: "🛠️",
  Education: "🎓",
  Game: "🎮",
  Graphics: "🎨",
  IDE: "⌨️",
  Network: "🌐",
  Office: "📄",
  Science: "🔬",
  Settings: "⚙️",
  Spreadsheet: "📊",
  System: "💻",
  Utility: "🧰",
  Video: "📹",
};

export async function fetchSlophubData() {
  const response = await fetch(APPS_URL);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = await response.json();

  validateReservedRoutes(payload.apps ?? []);

  return {
    apps: payload.apps ?? [],
    remote: payload.remote ?? null,
    generatedAt: payload.generated_at ?? null,
  };
}

export function validateReservedRoutes(apps) {
  const conflictingApp = apps.find((app) =>
    RESERVED_ROUTES.has(String(app?.app_id ?? "").toLowerCase()),
  );

  if (conflictingApp) {
    throw new Error(
      `App ID "${conflictingApp.app_id}" conflicts with a reserved route.`,
    );
  }
}

function filenameFromUrl(url, fallback) {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").filter(Boolean).at(-1);

    return filename || fallback;
  } catch {
    return fallback;
  }
}

function triggerDownload(href, filename) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename || "";
  document.body.append(link);
  link.click();
  link.remove();
}

async function downloadUrl(href, filename) {
  const response = await fetch(href, { credentials: "omit" });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    triggerDownload(objectUrl, filename);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function DownloadLink({ href, filename, className, children }) {
  const { t } = useI18n();
  const downloadFilename = filenameFromUrl(href, filename);

  return (
    <a
      className={className}
      href={href}
      download={downloadFilename}
      onClick={async (event) => {
        event.preventDefault();

        try {
          await downloadUrl(href, downloadFilename);
        } catch {
          window.alert(t("downloadFailed"));
        }
      }}
    >
      {children}
    </a>
  );
}

function RiskyLink({ href, download = false, className, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  function continueToTarget() {
    setIsOpen(false);

    if (download) {
      const filename = typeof download === "string" ? download : "";
      triggerDownload(href, filename);
      return;
    }

    const link = document.createElement("a");
    link.href = href;
    document.body.append(link);
    link.click();
    link.remove();
  }

  return (
    <>
      <a
        className={className}
        href={href}
        download={download}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        {children}
      </a>

      {isOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div
            className="risk-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="risk-modal-title"
          >
            <div className="risk-modal-icon">!</div>
            <div className="risk-modal-copy">
              <p className="eyebrow">{t("securityNotice")}</p>
              <h2 id="risk-modal-title">{t("installRiskTitle")}</h2>
              <p>{t("installRiskPrompt")}</p>
            </div>
            <div className="risk-modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                {t("cancel")}
              </button>
              <button className="btn btn-primary" onClick={continueToTarget}>
                {t("installRiskContinue")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function formatDate(value, locale, fallback) {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatDateTime(value, locale, fallback) {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function commandFor(app) {
  if (!app?.flatpakref_url) {
    return null;
  }

  return `flatpak install --user ${app.flatpakref_url}`;
}

function AppShell({ remote, generatedAt, children }) {
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    const htmlLangByLocale = {
      en: "en",
      es: "es",
      pt: "pt-BR",
    };

    document.documentElement.lang = htmlLangByLocale[locale] ?? "en";
  }, [locale]);

  return (
    <div className="shell">
      <header className="topbar">
        <a href={routePath("/")} className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
          />
          <div className="brand-copy">
            <strong>Slophub</strong>
            <span>{t("appRepository")}</span>
          </div>
        </a>

        <nav className="topnav" aria-label={t("primaryNavigation")}>
          <a href={routePath("/")}>{t("catalog")}</a>
          <a href={routePath("/docs")}>{t("docs")}</a>
          {remote?.repo_url ? <a href={remote.repo_url}>{t("repository")}</a> : null}
          {remote?.flatpakrepo_url ? (
            <DownloadLink href={remote.flatpakrepo_url} filename="slophub.flatpakrepo">
              {t("download")}
            </DownloadLink>
          ) : null}
        </nav>

        <label className="topbar-actions language-select">
          <span>{t("language")}</span>
          <select
            value={locale}
            aria-label={t("language")}
            onChange={(event) => setLocale(event.target.value)}
          >
            <option value="en">{t("english")}</option>
            <option value="es">{t("spanish")}</option>
            <option value="pt">{t("portuguese")}</option>
          </select>
        </label>
      </header>

      <main className="content">
        {children}

        <footer className="footer-note">
          <span>
            {t("metadataSynced")}: {formatDate(generatedAt, locale, t("unknown"))}
          </span>
          <span>{remote?.description ?? t("fetchingRemoteFallback")}</span>
        </footer>
      </main>
    </div>
  );
}

function StateView({ title, copy, action }) {
  const { t } = useI18n();

  return (
    <div className="state-card">
      <p className="eyebrow">{t("slophub")}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
      {action}
    </div>
  );
}

export function DocsApp(props) {
  return (
    <I18nProvider>
      <DocsPage {...props} />
    </I18nProvider>
  );
}

export function HomeApp(props) {
  return (
    <I18nProvider>
      <HomePage {...props} />
    </I18nProvider>
  );
}

export function DetailApp(props) {
  return (
    <I18nProvider>
      <DetailPage {...props} />
    </I18nProvider>
  );
}

export function DocsPage({ remote = null, generatedAt = null }) {
  const { t } = useI18n();

  const questions = [
    ["docsFaqWhatQuestion", "docsFaqWhatAnswer"],
    ["docsFaqInstallQuestion", "docsFaqInstallAnswer"],
    ["docsFaqSafetyQuestion", "docsFaqSafetyAnswer"],
    ["docsFaqAddAppQuestion", "docsFaqAddAppAnswer"],
    ["docsFaqBrokenQuestion", "docsFaqBrokenAnswer"],
  ];

  return (
    <AppShell remote={remote} generatedAt={generatedAt}>
      <section className="docs-shell" aria-labelledby="docs-title">
        <div className="docs-hero">
          <p className="eyebrow">{t("communityDocs")}</p>
          <h1 id="docs-title">{t("docsTitle")}</h1>
          <p className="docs-copy">{t("docsCopy")}</p>
        </div>

        <div className="docs-grid">
          <article className="docs-card">
            <span className="docs-card-icon" aria-hidden="true">
              🧭
            </span>
            <h2>{t("docsGettingStarted")}</h2>
            <ol className="docs-steps">
              <li>{t("docsStepBrowse")}</li>
              <li>{t("docsStepReview")}</li>
              <li>{t("docsStepInstall")}</li>
            </ol>
          </article>

          <article className="docs-card">
            <span className="docs-card-icon" aria-hidden="true">
              🤝
            </span>
            <h2>{t("docsCommunityHelp")}</h2>
            <p>{t("docsCommunityHelpCopy")}</p>
            {remote?.repo_url ? (
              <a className="btn btn-secondary" href={remote.repo_url}>
                {t("openSourceFeed")}
              </a>
            ) : null}
          </article>
        </div>

        <section className="docs-faq" aria-labelledby="docs-faq-title">
          <p className="eyebrow">{t("docsFaqEyebrow")}</p>
          <h2 id="docs-faq-title">{t("docsFaqTitle")}</h2>
          <div className="docs-faq-list">
            {questions.map(([questionKey, answerKey]) => (
              <article className="docs-faq-item" key={questionKey}>
                <h3>{t(questionKey)}</h3>
                <p>{t(answerKey)}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}

export function HomePage({ apps = [], remote = null, generatedAt = null }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  const { locale, t } = useI18n();

  const categoryCounts = useMemo(() => {
    return apps.reduce(
      (counts, app) => {
        counts.all += 1;

        new Set(categoriesForApp(app)).forEach((appCategory) => {
          counts[appCategory] = (counts[appCategory] ?? 0) + 1;
        });

        return counts;
      },
      { all: 0 },
    );
  }, [apps]);

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesCategory = !category || categoriesForApp(app).includes(category);
      const matchesQuery = normalizedQuery
        ? [app.title, app.description, app.app_id, app.release?.tag]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;

      return matchesCategory && matchesQuery;
    });
  }, [apps, category, query]);

  return (
    <AppShell remote={remote} generatedAt={generatedAt}>
      <section className="hero">
        <div className="hero-kicker">
          <span className="status-dot" />
          <span>{t("trustedCatalog")}</span>
        </div>
        <h1>{t("heroTitle")}</h1>
        <p className="hero-copy">{t("heroCopy")}</p>

        <label className="hero-search">
          <span>{t("search")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </label>

        <div className="hero-metrics" aria-label={t("catalogStats")}>
          <div>
            <strong>{apps.length}</strong>
            <span>{t("appsIndexed")}</span>
          </div>
          <div>
            <strong>{remote?.title ?? "Slophub"}</strong>
            <span>{t("source")}</span>
          </div>
          <div>
            <strong>{formatDate(generatedAt, locale, t("unknown"))}</strong>
            <span>{t("lastSync")}</span>
          </div>
        </div>
      </section>

      <section className="repository-layout" id="catalog">
        <aside className="filter-panel" aria-label={t("filters")}>
          <p className="eyebrow">{t("explore")}</p>
          <h2>{t("browseByCategory")}</h2>
          <p>{t("browseByCategoryCopy")}</p>

          <div className="category-list">
            <button
              className={`category-button ${category === null ? "active" : ""}`}
              onClick={() => setCategory(null)}
            >
              <span>{t("category.all")}</span>
              <strong>{categoryCounts.all ?? 0}</strong>
            </button>
            {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                className={`category-button ${category === key ? "active" : ""}`}
                onClick={() => setCategory(key)}
              >
                <span>{categoryLabel(key, t)}</span>
                <strong>{categoryCounts[key] ?? 0}</strong>
              </button>
            ))}
          </div>
        </aside>

        <div className="catalog-shell">
          <div className="catalog-header">
            <div>
              <p className="eyebrow">{t("catalog")}</p>
              <h2>{t("listedApplications")}</h2>
              <p className="section-copy">{t("catalogCopy")}</p>
            </div>
            <div className="result-count">
              {filteredApps.length} {t("results")}
            </div>
          </div>

          <div className="app-grid">
            {filteredApps.map((app) => (
              <a key={app.app_id} href={appRoute(app.app_id)} className="app-card">
                <div className="app-head">
                  <img className="app-icon-image" src={app.icon_url} alt="" />
                  <div>
                    <h3>{app.title}</h3>
                    <p>{app.app_id}</p>
                  </div>
                </div>
                <p className="app-description">{app.description}</p>
                <div className="badge-row">
                  {categoriesForApp(app).map((appCategory) => (
                    <span key={appCategory} className="badge badge-solid">
                      {categoryLabel(appCategory, t)}
                    </span>
                  ))}
                  <span className="badge badge-neutral">
                    {app.release?.tag ?? app.branch}
                  </span>
                </div>
                <div className="app-meta">
                  <span>
                    {t("published")} {formatDate(app.release?.published_at, locale, t("unknown"))}
                  </span>
                  <strong>{t("viewListing")}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function ScreenshotSlider({ screenshots }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { t } = useI18n();
  const validScreenshots = Array.isArray(screenshots)
    ? screenshots.filter((screenshot) => screenshot?.url)
    : [];

  const activeScreenshot = validScreenshots[activeIndex];
  const hasMultipleScreenshots = validScreenshots.length > 1;

  useEffect(() => {
    if (activeScreenshot?.url) {
      setIsImageLoading(true);
    }
  }, [activeScreenshot?.url]);

  if (validScreenshots.length === 0) {
    return null;
  }

  function showPrevious() {
    setActiveIndex((index) =>
      index === 0 ? validScreenshots.length - 1 : index - 1,
    );
  }

  function showNext() {
    setActiveIndex((index) =>
      index === validScreenshots.length - 1 ? 0 : index + 1,
    );
  }

  return (
    <section className="screenshot-slider" aria-label={t("screenshots")}>
      <div className="screenshot-slider-header">
        <div>
          <p className="eyebrow">{t("preview")}</p>
          <h2>{t("screenshots")}</h2>
        </div>
        {hasMultipleScreenshots ? (
          <div className="screenshot-controls">
            <button type="button" onClick={showPrevious} aria-label={t("previousScreenshot")}>
              ←
            </button>
            <span>
              {activeIndex + 1} / {validScreenshots.length}
            </span>
            <button type="button" onClick={showNext} aria-label={t("nextScreenshot")}>
              →
            </button>
          </div>
        ) : null}
      </div>

      <figure className={`screenshot-frame${isImageLoading ? " is-loading" : ""}`}>
        {isImageLoading ? (
          <div className="screenshot-loading" role="status" aria-live="polite">
            <span className="screenshot-spinner" aria-hidden="true" />
            <span>{t("loadingScreenshot")}</span>
          </div>
        ) : null}
        <img
          src={activeScreenshot.url}
          alt={activeScreenshot.caption ?? t("appScreenshot")}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
        {activeScreenshot.caption ? <figcaption>{activeScreenshot.caption}</figcaption> : null}
      </figure>

      {hasMultipleScreenshots ? (
        <div className="screenshot-dots" aria-label={t("screenshotNavigation")}>
          {validScreenshots.map((screenshot, index) => (
            <button
              key={`${screenshot.url}-${index}`}
              type="button"
              className={index === activeIndex ? "active" : ""}
              aria-label={t("openScreenshot", { index: index + 1 })}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function DetailPage({ app, remote = null, generatedAt = null }) {
  const { locale, t } = useI18n();

  if (!app) {
    return (
      <AppShell remote={remote} generatedAt={generatedAt}>
        <StateView
          title={t("applicationNotFound")}
          copy={t("noPackageMatches", { appId: "" })}
          action={
            <a className="btn btn-primary" href={routePath("/")}>
              {t("backToCatalog")}
            </a>
          }
        />
      </AppShell>
    );
  }

  const installCommand = commandFor(app);

  return (
    <AppShell remote={remote} generatedAt={generatedAt}>
      <div className="page-backlink">
        <a href={routePath("/")}>← {t("backToCatalog")}</a>
      </div>

      <section className="detail-shell">
        <div className="detail-hero">
          <div className="detail-identity">
            <img className="detail-icon-image" src={app.icon_url} alt="" />
            <div className="detail-heading">
              <p className="eyebrow">
                {categoriesForApp(app)
                  .map((appCategory) => categoryLabel(appCategory, t))
                  .join(" · ") || t("uncategorized")}
              </p>
              <h1>{app.title}</h1>
              <p className="detail-description">{app.description}</p>
            </div>
          </div>

          <aside className="action-panel">
            <h2>{t("installAndResources")}</h2>
            <div className="detail-actions">
              {app.flatpakref_url ? (
                <RiskyLink className="btn btn-primary" href={app.flatpakref_url}>
                  {t("installViaFlatpak")}
                </RiskyLink>
              ) : null}
              {app.bundle?.download_url ? (
                <RiskyLink
                  className="btn btn-secondary"
                  href={app.bundle.download_url}
                  download={app.bundle.asset_name ?? true}
                >
                  {t("downloadBundle")}
                </RiskyLink>
              ) : null}
              {app.homepage_url ? (
                <a className="btn btn-ghost" href={app.homepage_url}>
                  {t("homepage")}
                </a>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="overview-row">
          <div className="overview-card">
            <span>{t("branch")}</span>
            <strong>{app.branch}</strong>
          </div>
          <div className="overview-card">
            <span>{t("releaseName")}</span>
            <strong>{app.release?.tag ?? app.release?.name ?? t("unknown")}</strong>
          </div>
          <div className="overview-card">
            <span>{t("publishedAt")}</span>
            <strong>{formatDateTime(app.release?.published_at, locale, t("unknown"))}</strong>
          </div>
          <div className="overview-card">
            <span>{t("source")}</span>
            <strong>{remote?.name ?? "slophub"}</strong>
          </div>
        </div>

        <ScreenshotSlider screenshots={app.screenshots} />

        <div className="detail-body">
          <div className="preview-panel">
            <div className="detail-section">
              <h2>{t("applicationId")}</h2>
              <p className="detail-copy">{app.app_id}</p>
            </div>

            <div className="detail-section">
              <h2>{t("installCommand")}</h2>
              <pre className="command-block">
                <code>{installCommand ?? t("noInstallCommand")}</code>
              </pre>
            </div>

            <div className="detail-section">
              <h2>{t("releaseDetails")}</h2>
              <div className="release-grid">
                <div>
                  <span>{t("releaseName")}</span>
                  <strong>{app.release?.name ?? t("unknown")}</strong>
                </div>
                <div>
                  <span>{t("published")}</span>
                  <strong>{formatDateTime(app.release?.published_at, locale, t("unknown"))}</strong>
                </div>
                <div>
                  <span>{t("bundleSha")}</span>
                  <strong className="hash-block">{app.bundle?.sha256 ?? t("unavailable")}</strong>
                </div>
              </div>
            </div>
          </div>

          <aside className="spec-panel">
            <div className="spec-item">
              <span>{t("bundleFile")}</span>
              <strong>{app.bundle?.asset_name ?? t("unknown")}</strong>
            </div>
            <div className="spec-item">
              <span>{t("upstreamRelease")}</span>
              <strong>
                {app.release?.url ? <a href={app.release.url}>{t("openReleaseNotes")}</a> : t("unavailable")}
              </strong>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function categoriesForApp(app) {
  if (!Array.isArray(app?.categories)) {
    return [];
  }

  return [...new Set(app.categories)].filter((category) =>
    CATEGORY_KEYS.includes(category),
  );
}

function categoryLabel(category, t) {
  const emoji = CATEGORY_EMOJIS[category];
  const label = t(`category.${category}`);

  return emoji ? `${emoji} ${label}` : label;
}
