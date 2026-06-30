import { createContext, useContext, useMemo, useState } from "react";

const dictionaries = {
  en: {
    appMarketplace: "AI app catalog",
    theme: "Theme",
    language: "Language",
    curatedNotScraped:
      "Curated, not scraped. Real packages, real release files, direct install targets.",
    remote: "Remote",
    loadingRemote: "Loading remote",
    fetchingRemoteFallback:
      "Fetching repository metadata, release links, and publication details.",
    metadataSynced: "Metadata synced",
    slophub: "Slophub",
    loadingApplications: "Loading applications",
    fetchingPackages: "Fetching Slophub packages and release metadata.",
    couldNotLoadSlophub: "Could not load Slophub",
    unknownError: "Unknown error while loading data.",
    openSourceFeed: "Open source feed",
    beyondTheSlop: "Beyond the slop",
    heroTitle: "AI apps with actual taste, packaged for direct install.",
    heroCopy:
      "Slophub is a curated catalog of AI-adjacent desktop apps that do something real: clear metadata, upstream releases, and Flatpak install targets in one place.",
    appsIndexed: "apps indexed",
    lastSync: "Last sync",
    catalog: "Catalog",
    curatedApplications: "Curated applications",
    results: "results",
    catalogCopy:
      "Search by title, application ID, or summary. Open any card for release details, upstream links, and Flatpak installation files.",
    search: "Search",
    searchPlaceholder: "Parquetta, query tools, DuckDB...",
    published: "Published",
    openAppPage: "Open app page",
    loadingApplication: "Loading application",
    resolvingPackage: "Resolving package metadata and install targets.",
    couldNotLoadApplication: "Could not load application",
    backToCatalog: "Back to catalog",
    applicationNotFound: "Application not found",
    noPackageMatches: 'No Slophub package matches "{appId}".',
    application: "Application",
    installViaFlatpak: "Install via Flatpak",
    downloadBundle: "Download bundle",
    homepage: "Homepage",
    flatpakMetadata: "Flatpak metadata",
    applicationId: "Application ID",
    installCommand: "Install command",
    noInstallCommand: "No Flatpak install command available",
    releaseDetails: "Release details",
    overview: "Overview",
    publishedAt: "Published",
    source: "Source",
    releaseName: "Release name",
    bundleSha: "Bundle SHA256",
    bundleFile: "Bundle file",
    branch: "Branch",
    upstreamRelease: "Upstream release",
    openReleaseNotes: "Open release notes",
    remoteRepository: "Remote repository",
    openRepository: "Open repository",
    unavailable: "Unavailable",
    unknown: "Unknown",
    portuguese: "Portuguese",
    english: "English",
  },
  pt: {
    appMarketplace: "Catálogo de apps de IA",
    theme: "Tema",
    language: "Idioma",
    curatedNotScraped:
      "Curado, não raspado. Pacotes reais, arquivos de release reais e destinos diretos de instalação.",
    remote: "Remoto",
    loadingRemote: "Carregando remoto",
    fetchingRemoteFallback:
      "Buscando metadados do repositório, links de release e detalhes de publicação.",
    metadataSynced: "Metadados sincronizados",
    slophub: "Slophub",
    loadingApplications: "Carregando aplicações",
    fetchingPackages: "Buscando pacotes do Slophub e metadados de release.",
    couldNotLoadSlophub: "Não foi possível carregar o Slophub",
    unknownError: "Erro desconhecido ao carregar dados.",
    openSourceFeed: "Abrir feed de origem",
    beyondTheSlop: "Além do slop",
    heroTitle: "Apps de IA com critério, empacotados para instalação direta.",
    heroCopy:
      "Slophub é um catálogo curado de apps desktop com IA ou adjacentes a IA que fazem algo real: metadados claros, releases upstream e alvos de instalação Flatpak no mesmo lugar.",
    appsIndexed: "apps indexados",
    lastSync: "Última sincronização",
    catalog: "Catálogo",
    curatedApplications: "Aplicações curadas",
    results: "resultados",
    catalogCopy:
      "Pesquise por título, ID da aplicação ou resumo. Abra qualquer card para ver detalhes de release, links upstream e arquivos de instalação Flatpak.",
    search: "Buscar",
    searchPlaceholder: "Parquetta, query tools, DuckDB...",
    published: "Publicado",
    openAppPage: "Abrir página do app",
    loadingApplication: "Carregando aplicação",
    resolvingPackage: "Resolvendo metadados do pacote e destinos de instalação.",
    couldNotLoadApplication: "Não foi possível carregar a aplicação",
    backToCatalog: "Voltar ao catálogo",
    applicationNotFound: "Aplicação não encontrada",
    noPackageMatches: 'Nenhum pacote do Slophub corresponde a "{appId}".',
    application: "Aplicação",
    installViaFlatpak: "Instalar via Flatpak",
    downloadBundle: "Baixar bundle",
    homepage: "Homepage",
    flatpakMetadata: "Metadados Flatpak",
    applicationId: "ID da aplicação",
    installCommand: "Comando de instalação",
    noInstallCommand: "Nenhum comando de instalação Flatpak disponível",
    releaseDetails: "Detalhes da release",
    overview: "Visão geral",
    publishedAt: "Publicado",
    source: "Origem",
    releaseName: "Nome da release",
    bundleSha: "SHA256 do bundle",
    bundleFile: "Arquivo do bundle",
    branch: "Branch",
    upstreamRelease: "Release upstream",
    openReleaseNotes: "Abrir release notes",
    remoteRepository: "Repositório remoto",
    openRepository: "Abrir repositório",
    unavailable: "Indisponível",
    unknown: "Desconhecido",
    portuguese: "Português",
    english: "Inglês",
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("en");

  const value = useMemo(() => {
    const messages = dictionaries[locale];

    function t(key, vars = {}) {
      let template = messages[key] ?? dictionaries.en[key] ?? key;

      Object.entries(vars).forEach(([name, value]) => {
        template = template.replace(`{${name}}`, String(value));
      });

      return template;
    }

    return {
      locale,
      setLocale,
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
