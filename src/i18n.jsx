import { createContext, useContext, useMemo, useState } from "react";

const dictionaries = {
  en: {
    appMarketplace: "App marketplace",
    language: "Language",
    primaryNavigation: "Primary navigation",
    trustedCatalog: "Community-indexed Flatpak marketplace",
    remote: "Remote",
    repository: "Repository",
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
    heroTitle: "Find install-ready AI and data apps for your desktop.",
    heroCopy:
      "Explore an app index with clear metadata, upstream releases, Flatpak install targets, and a marketplace experience built for fast discovery.",
    appsIndexed: "apps indexed",
    lastSync: "Last sync",
    catalogStats: "Catalog stats",
    catalog: "Catalog",
    listedApplications: "Listed applications",
    results: "results",
    catalogCopy:
      "Compare listings, scan release details, and open any app page for installation files and upstream resources.",
    search: "Search apps",
    searchPlaceholder: "Search by name, app ID, DuckDB, Flatpak...",
    filters: "Filters",
    explore: "Explore",
    browseByCategory: "Browse by category",
    browseByCategoryCopy:
      "Use the category rail to narrow the marketplace while keeping search active.",
    "category.all": "All apps",
    "category.data": "Data & analytics",
    "category.developer": "Developer tools",
    "category.productivity": "Productivity",
    "category.ai": "AI tools",
    published: "Published",
    viewListing: "View listing",
    openAppPage: "Open app page",
    loadingApplication: "Loading application",
    resolvingPackage: "Resolving package metadata and install targets.",
    couldNotLoadApplication: "Could not load application",
    backToCatalog: "Back to catalog",
    applicationNotFound: "Application not found",
    noPackageMatches: 'No Slophub package matches "{appId}".',
    application: "Application",
    installAndResources: "Install and resources",
    securityNotice: "Security notice",
    installRiskTitle: "Review before continuing",
    installRiskPrompt:
      "These projects come from external sources and are not audited by Slophub. Installing or downloading them can expose your system and data to security risks. Continue only if you understand the risks.",
    installRiskContinue: "I understand, continue",
    cancel: "Cancel",
    installViaFlatpak: "Install via Flatpak",
    download: "Download",
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

    unavailable: "Unavailable",
    unknown: "Unknown",
    portuguese: "Portuguese",
    english: "English",
  },
  pt: {
    appMarketplace: "Marketplace de apps",
    language: "Idioma",
    primaryNavigation: "Navegação principal",
    trustedCatalog: "Marketplace Flatpak comunitário",
    remote: "Remoto",
    repository: "Repositório",
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
    heroTitle: "Encontre apps de IA e dados prontos para instalar no desktop.",
    heroCopy:
      "Explore um índice de apps com metadados claros, releases upstream, alvos de instalação Flatpak e uma experiência de marketplace pensada para descoberta rápida.",
    appsIndexed: "apps indexados",
    lastSync: "Última sincronização",
    catalogStats: "Estatísticas do catálogo",
    catalog: "Catálogo",
    listedApplications: "Aplicações listadas",
    results: "resultados",
    catalogCopy:
      "Compare listagens, veja detalhes de release rapidamente e abra qualquer página para acessar arquivos de instalação e recursos upstream.",
    search: "Buscar apps",
    searchPlaceholder: "Busque por nome, ID, DuckDB, Flatpak...",
    filters: "Filtros",
    explore: "Explorar",
    browseByCategory: "Navegue por categoria",
    browseByCategoryCopy:
      "Use a trilha de categorias para refinar o marketplace sem perder a busca ativa.",
    "category.all": "Todos os apps",
    "category.data": "Dados e analytics",
    "category.developer": "Ferramentas dev",
    "category.productivity": "Produtividade",
    "category.ai": "Ferramentas de IA",
    published: "Publicado",
    viewListing: "Ver listagem",
    openAppPage: "Abrir página do app",
    loadingApplication: "Carregando aplicação",
    resolvingPackage:
      "Resolvendo metadados do pacote e destinos de instalação.",
    couldNotLoadApplication: "Não foi possível carregar a aplicação",
    backToCatalog: "Voltar ao catálogo",
    applicationNotFound: "Aplicação não encontrada",
    noPackageMatches: 'Nenhum pacote do Slophub corresponde a "{appId}".',
    application: "Aplicação",
    installAndResources: "Instalação e recursos",
    securityNotice: "Aviso de segurança",
    installRiskTitle: "Revise antes de continuar",
    installRiskPrompt:
      "Estes projetos vêm de fontes externas e não são auditados pelo Slophub. Instalar ou baixar esses arquivos pode expor seu sistema e seus dados a riscos de segurança. Continue apenas se você entende os riscos.",
    installRiskContinue: "Estou ciente, continuar",
    cancel: "Cancelar",
    installViaFlatpak: "Instalar via Flatpak",
    download: "Download",
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

    unavailable: "Indisponível",
    unknown: "Desconhecido",
    portuguese: "Português",
    english: "Inglês",
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("pt");

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
