import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { useI18n } from "./i18n";

const APPS_URL = "https://ai-slophub.github.io/slophub/apps.json";

function useSlophubData() {
  const [state, setState] = useState({
    status: "loading",
    apps: [],
    remote: null,
    generatedAt: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(APPS_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (!cancelled) {
          setState({
            status: "ready",
            apps: payload.apps ?? [],
            remote: payload.remote ?? null,
            generatedAt: payload.generated_at ?? null,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            apps: [],
            remote: null,
            generatedAt: null,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function formatDate(value, locale, fallback) {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}

function AppShell({ remote, generatedAt, children }) {
  const [theme, setTheme] = useState("nova");
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">{t("appMarketplace")}</p>
            <h1>Slophub</h1>
          </div>
        </Link>

        <div className="sidebar-panel">
          <p className="sidebar-label">{t("theme")}</p>
          <div className="theme-switcher">
            {["nova", "pulse", "lava"].map((item) => (
              <button
                key={item}
                className={`theme-dot ${theme === item ? "active" : ""}`}
                data-theme={item}
                aria-label={`${item} theme`}
                onClick={() => setTheme(item)}
              />
            ))}
          </div>
          <p className="sidebar-copy">{t("curatedNotScraped")}</p>
        </div>

        <div className="sidebar-panel">
          <p className="sidebar-label">{t("language")}</p>
          <div className="locale-switcher">
            <button
              className={`locale-pill ${locale === "en" ? "active" : ""}`}
              onClick={() => setLocale("en")}
            >
              {t("english")}
            </button>
            <button
              className={`locale-pill ${locale === "pt" ? "active" : ""}`}
              onClick={() => setLocale("pt")}
            >
              {t("portuguese")}
            </button>
          </div>
        </div>

        <div className="sidebar-panel">
          <p className="sidebar-label">{t("remote")}</p>
          <strong>{remote?.title ?? t("loadingRemote")}</strong>
          <p className="sidebar-copy">
            {remote?.description ??
              t("fetchingRemoteFallback")}
          </p>
          <p className="sidebar-meta">
            {t("metadataSynced")} {formatDate(generatedAt, locale, t("unknown"))}
          </p>
        </div>
      </aside>

      <main className="content">{children}</main>
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

function HomePage({ status, apps, remote, generatedAt, error }) {
  const [query, setQuery] = useState("");
  const { locale, t } = useI18n();

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apps.filter((app) => {
      if (!normalizedQuery) {
        return true;
      }

      return [app.title, app.description, app.app_id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [apps, query]);

  if (status === "loading") {
    return (
      <StateView
        title={t("loadingApplications")}
        copy={t("fetchingPackages")}
      />
    );
  }

  if (status === "error") {
    return (
      <StateView
        title={t("couldNotLoadSlophub")}
        copy={error ?? t("unknownError")}
        action={
          <a className="btn btn-primary" href={APPS_URL}>
            {t("openSourceFeed")}
          </a>
        }
      />
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy-block">
          <p className="eyebrow">{t("beyondTheSlop")}</p>
          <h2>{t("heroTitle")}</h2>
          <p className="hero-copy">{t("heroCopy")}</p>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span className="status-dot" />
            <span>
              {apps.length} {t("appsIndexed")}
            </span>
          </div>
          <div className="metric-row">
            <div>
              <span>{t("remote")}</span>
              <strong>{remote?.name ?? "slophub"}</strong>
            </div>
            <div>
              <span>{t("lastSync")}</span>
              <strong>{formatDate(generatedAt, locale, t("unknown"))}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-shell">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">{t("catalog")}</p>
            <h3>{t("curatedApplications")}</h3>
            <p className="section-copy">{t("catalogCopy")}</p>
          </div>
          <label className="search-input">
            <span>{t("search")}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </label>
        </div>

        <div className="app-grid">
          {filteredApps.map((app, index) => (
            <Link
              key={app.app_id}
              to={`/${app.app_id}`}
              className="app-card"
              style={{ "--card-accent": accentByIndex(index) }}
            >
              <div className="app-head">
                <img className="app-icon-image" src={app.icon_url} alt="" />
                <div>
                  <h4>{app.title}</h4>
                  <p>{app.app_id}</p>
                </div>
              </div>
              <p className="app-description">{app.description}</p>
              <div className="badge-row">
                <span className="badge badge-solid">{app.branch}</span>
                {app.release?.tag ? (
                  <span className="badge badge-neutral">{app.release.tag}</span>
                ) : null}
              </div>
              <div className="app-meta">
                <span>
                  {t("published")} {formatDate(app.release?.published_at, locale, t("unknown"))}
                </span>
                <span>{t("openAppPage")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
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

function DetailPage({ status, apps, remote, error }) {
  const { appId } = useParams();
  const { locale, t } = useI18n();

  if (status === "loading") {
    return (
      <StateView
        title={t("loadingApplication")}
        copy={t("resolvingPackage")}
      />
    );
  }

  if (status === "error") {
    return (
      <StateView
        title={t("couldNotLoadApplication")}
        copy={error ?? t("unknownError")}
        action={
          <Link className="btn btn-primary" to="/">
            {t("backToCatalog")}
          </Link>
        }
      />
    );
  }

  const app = apps.find((item) => item.app_id === appId);

  if (!app) {
    return (
      <StateView
        title={t("applicationNotFound")}
        copy={t("noPackageMatches", { appId })}
        action={
          <Link className="btn btn-primary" to="/">
            {t("backToCatalog")}
          </Link>
        }
      />
    );
  }

  const installCommand = commandFor(app);

  return (
    <>
      <div className="page-backlink">
        <Link to="/">{t("backToCatalog")}</Link>
      </div>

      <section className="detail-shell">
        <div className="detail-top">
          <div className="detail-identity">
            <img className="detail-icon-image" src={app.icon_url} alt="" />
            <div>
              <p className="eyebrow">{t("application")}</p>
              <h2>{app.title}</h2>
              <p className="detail-description">{app.description}</p>
              <div className="badge-row">
                <span className="badge badge-solid">{app.branch}</span>
                {app.release?.tag ? (
                  <span className="badge badge-neutral">{app.release.tag}</span>
                ) : null}
                <span className="badge badge-neutral">{remote?.name ?? "slophub"}</span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            {app.flatpakref_url ? (
              <a className="btn btn-primary" href={app.flatpakref_url}>
                {t("installViaFlatpak")}
              </a>
            ) : null}
            {app.bundle?.download_url ? (
              <a className="btn btn-secondary" href={app.bundle.download_url}>
                {t("downloadBundle")}
              </a>
            ) : null}
            {app.homepage_url ? (
              <a className="btn btn-ghost" href={app.homepage_url}>
                {t("homepage")}
              </a>
            ) : null}
          </div>
        </div>

        <div className="detail-body">
          <div className="preview-panel">
            <div className="preview-header">
              <span className="status-dot" />
              <span>{t("flatpakMetadata")}</span>
            </div>

            <div className="detail-section">
              <h3>{t("applicationId")}</h3>
              <p className="detail-copy">{app.app_id}</p>
            </div>

            <div className="detail-section">
              <h3>{t("installCommand")}</h3>
              <pre className="command-block">
                <code>{installCommand ?? t("noInstallCommand")}</code>
              </pre>
            </div>

            <div className="detail-section">
              <h3>{t("releaseDetails")}</h3>
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
              <span>{t("branch")}</span>
              <strong>{app.branch}</strong>
            </div>
            <div className="spec-item">
              <span>{t("upstreamRelease")}</span>
              <strong>
                {app.release?.url ? (
                  <a href={app.release.url}>{t("openReleaseNotes")}</a>
                ) : (
                  t("unavailable")
                )}
              </strong>
            </div>
            <div className="spec-item">
              <span>{t("remoteRepository")}</span>
              <strong>
                {remote?.repo_url ? (
                  <a href={remote.repo_url}>{t("openRepository")}</a>
                ) : (
                  t("unavailable")
                )}
              </strong>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function accentByIndex(index) {
  const accents = [
    "linear-gradient(135deg, #7c5cff, #1fd1c2)",
    "linear-gradient(135deg, #ff4d8d, #ffb84d)",
    "linear-gradient(135deg, #45caff, #74e27f)",
    "linear-gradient(135deg, #9b5cff, #ff7a18)",
  ];

  return accents[index % accents.length];
}

export default function App() {
  const data = useSlophubData();

  return (
    <AppShell remote={data.remote} generatedAt={data.generatedAt}>
      <Routes>
        <Route path="/" element={<HomePage {...data} />} />
        <Route path="/:appId" element={<DetailPage {...data} />} />
      </Routes>
    </AppShell>
  );
}
