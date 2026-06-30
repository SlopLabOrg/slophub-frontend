import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

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

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function AppShell({ remote, generatedAt, children }) {
  const [theme, setTheme] = useState("nova");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">App marketplace</p>
            <h1>Slophub</h1>
          </div>
        </Link>

        <div className="sidebar-panel">
          <p className="sidebar-label">Theme</p>
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
          <p className="sidebar-copy">
            Color-driven storefront for independent Flatpak distribution.
          </p>
        </div>

        <div className="sidebar-panel">
          <p className="sidebar-label">Remote</p>
          <strong>{remote?.title ?? "Loading remote"}</strong>
          <p className="sidebar-copy">
            {remote?.description ?? "Fetching remote metadata."}
          </p>
          <p className="sidebar-meta">Updated {formatDate(generatedAt)}</p>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

function StateView({ title, copy, action }) {
  return (
    <div className="state-card">
      <p className="eyebrow">Slophub</p>
      <h2>{title}</h2>
      <p>{copy}</p>
      {action}
    </div>
  );
}

function HomePage({ status, apps, remote, generatedAt, error }) {
  const [query, setQuery] = useState("");

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
        title="Loading applications"
        copy="Fetching Slophub packages and release metadata."
      />
    );
  }

  if (status === "error") {
    return (
      <StateView
        title="Could not load Slophub"
        copy={error ?? "Unknown error while loading data."}
        action={
          <a className="btn btn-primary" href={APPS_URL}>
            Open source feed
          </a>
        }
      />
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy-block">
          <p className="eyebrow">Visual system meets live catalog</p>
          <h2>Discover independent desktop apps with a stronger storefront.</h2>
          <p className="hero-copy">
            A vivid catalog for browsing releases, opening app details, and jumping
            straight into installation files and upstream projects.
          </p>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span className="status-dot" />
            <span>{apps.length} apps indexed</span>
          </div>
          <div className="metric-row">
            <div>
              <span>Remote</span>
              <strong>{remote?.name ?? "slophub"}</strong>
            </div>
            <div>
              <span>Last sync</span>
              <strong>{formatDate(generatedAt)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-shell">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h3>Available apps</h3>
            <p className="section-copy">
              Search by title, package id, or summary. Open any card for a dedicated product page.
            </p>
          </div>
          <label className="search-input">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Parquetta, query tools, DuckDB..."
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
                <span>Published {formatDate(app.release?.published_at)}</span>
                <span>Open details</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function PlaceholderDetail() {
  return (
    <StateView
      title="App page coming next"
      copy="The dedicated route exists in the next commit."
      action={
        <Link className="btn btn-primary" to="/">
          Back to catalog
        </Link>
      }
    />
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
        <Route path="/:appId" element={<PlaceholderDetail />} />
      </Routes>
    </AppShell>
  );
}
