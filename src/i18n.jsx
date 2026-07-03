import { createContext, useContext, useMemo, useState } from "react";

const dictionaries = {
  en: {
    appRepository: "App repository",
    language: "Language",
    primaryNavigation: "Primary navigation",
    trustedCatalog: "Community-indexed Flatpak repository",
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
      "Explore an app index with clear metadata, upstream releases, Flatpak install targets, and an organized repository experience built for fast discovery.",
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
      "Use the category rail to narrow the repository while keeping search active.",
    "category.all": "All apps",
    "category.Audio": "Audio",
    "category.AudioVideo": "Audio & video",
    "category.Database": "Database",
    "category.Development": "Development",
    "category.Education": "Education",
    "category.Game": "Games",
    "category.Graphics": "Graphics",
    "category.IDE": "IDE",
    "category.Network": "Network",
    "category.Office": "Office",
    "category.Science": "Science",
    "category.Settings": "Settings",
    "category.Spreadsheet": "Spreadsheet",
    "category.System": "System",
    "category.Utility": "Utility",
    "category.Video": "Video",
    uncategorized: "Uncategorized",
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
    downloadFailed:
      "Could not download the repository automatically. Please try again later.",
    downloadBundle: "Download bundle",
    homepage: "Homepage",
    flatpakMetadata: "Flatpak metadata",
    applicationId: "Application ID",
    installCommand: "Install command",
    noInstallCommand: "No Flatpak install command available",
    releaseDetails: "Release details",
    preview: "Preview",
    screenshots: "Screenshots",
    appScreenshot: "App screenshot",
    previousScreenshot: "Previous screenshot",
    nextScreenshot: "Next screenshot",
    screenshotNavigation: "Screenshot navigation",
    openScreenshot: "Open screenshot {index}",
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
    spanish: "Spanish",
    portuguese: "Portuguese",
    english: "English",
  },
  es: {
    appRepository: "Repositorio de apps",
    language: "Idioma",
    primaryNavigation: "Navegación principal",
    trustedCatalog: "Repositorio Flatpak indexado por la comunidad",
    remote: "Remoto",
    repository: "Repositorio",
    loadingRemote: "Cargando remoto",
    fetchingRemoteFallback:
      "Obteniendo metadatos del repositorio, enlaces de release y detalles de publicación.",
    metadataSynced: "Metadatos sincronizados",
    slophub: "Slophub",
    loadingApplications: "Cargando aplicaciones",
    fetchingPackages: "Obteniendo paquetes de Slophub y metadatos de release.",
    couldNotLoadSlophub: "No se pudo cargar Slophub",
    unknownError: "Error desconocido al cargar los datos.",
    openSourceFeed: "Abrir feed de origen",
    heroTitle:
      "Encuentra apps de IA y datos listas para instalar en tu escritorio.",
    heroCopy:
      "Explora un índice de apps con metadatos claros, releases upstream, destinos de instalación Flatpak y una experiencia de repositorio pensada para descubrir rápido.",
    appsIndexed: "apps indexadas",
    lastSync: "Última sincronización",
    catalogStats: "Estadísticas del catálogo",
    catalog: "Catálogo",
    listedApplications: "Aplicaciones listadas",
    results: "resultados",
    catalogCopy:
      "Compara listados, revisa detalles de release y abre cualquier página para acceder a archivos de instalación y recursos upstream.",
    search: "Buscar apps",
    searchPlaceholder: "Busca por nombre, ID, DuckDB, Flatpak...",
    filters: "Filtros",
    explore: "Explorar",
    browseByCategory: "Explora por categoría",
    browseByCategoryCopy:
      "Usa la lista de categorías para refinar el repositorio sin perder la búsqueda activa.",
    "category.all": "Todas las apps",
    "category.Audio": "Audio",
    "category.AudioVideo": "Audio y video",
    "category.Database": "Base de datos",
    "category.Development": "Desarrollo",
    "category.Education": "Educación",
    "category.Game": "Juegos",
    "category.Graphics": "Gráficos",
    "category.IDE": "IDE",
    "category.Network": "Red",
    "category.Office": "Oficina",
    "category.Science": "Ciencia",
    "category.Settings": "Configuración",
    "category.Spreadsheet": "Hoja de cálculo",
    "category.System": "Sistema",
    "category.Utility": "Utilidades",
    "category.Video": "Video",
    uncategorized: "Sin categoría",
    published: "Publicado",
    viewListing: "Ver listado",
    openAppPage: "Abrir página de la app",
    loadingApplication: "Cargando aplicación",
    resolvingPackage:
      "Resolviendo metadatos del paquete y destinos de instalación.",
    couldNotLoadApplication: "No se pudo cargar la aplicación",
    backToCatalog: "Volver al catálogo",
    applicationNotFound: "Aplicación no encontrada",
    noPackageMatches: 'Ningún paquete de Slophub coincide con "{appId}".',
    application: "Aplicación",
    installAndResources: "Instalación y recursos",
    securityNotice: "Aviso de seguridad",
    installRiskTitle: "Revisa antes de continuar",
    installRiskPrompt:
      "Estos proyectos vienen de fuentes externas y no son auditados por Slophub. Instalarlos o descargarlos puede exponer tu sistema y tus datos a riesgos de seguridad. Continúa solo si entiendes los riesgos.",
    installRiskContinue: "Entiendo, continuar",
    cancel: "Cancelar",
    installViaFlatpak: "Instalar vía Flatpak",
    download: "Download",
    downloadFailed:
      "No se pudo descargar el repositorio automáticamente. Inténtalo de nuevo más tarde.",
    downloadBundle: "Descargar bundle",
    homepage: "Homepage",
    flatpakMetadata: "Metadatos Flatpak",
    applicationId: "ID de la aplicación",
    installCommand: "Comando de instalación",
    noInstallCommand: "No hay comando de instalación Flatpak disponible",
    releaseDetails: "Detalles de la release",
    preview: "Vista previa",
    screenshots: "Capturas de pantalla",
    appScreenshot: "Captura de pantalla de la app",
    previousScreenshot: "Captura anterior",
    nextScreenshot: "Siguiente captura",
    screenshotNavigation: "Navegación de capturas",
    openScreenshot: "Abrir captura {index}",
    overview: "Resumen",
    publishedAt: "Publicado",
    source: "Origen",
    releaseName: "Nombre de la release",
    bundleSha: "SHA256 del bundle",
    bundleFile: "Archivo del bundle",
    branch: "Branch",
    upstreamRelease: "Release upstream",
    openReleaseNotes: "Abrir notas de release",

    unavailable: "No disponible",
    unknown: "Desconocido",
    spanish: "Español",
    portuguese: "Portugués",
    english: "Inglés",
  },
  pt: {
    appRepository: "Repositório de apps",
    language: "Idioma",
    primaryNavigation: "Navegação principal",
    trustedCatalog: "Repositório Flatpak comunitário",
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
      "Explore um índice de apps com metadados claros, releases upstream, alvos de instalação Flatpak e uma experiência de repositório pensada para descoberta rápida.",
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
      "Use a trilha de categorias para refinar o repositório sem perder a busca ativa.",
    "category.all": "Todos os apps",
    "category.Audio": "Áudio",
    "category.AudioVideo": "Áudio e vídeo",
    "category.Database": "Banco de dados",
    "category.Development": "Desenvolvimento",
    "category.Education": "Educação",
    "category.Game": "Jogos",
    "category.Graphics": "Gráficos",
    "category.IDE": "IDE",
    "category.Network": "Rede",
    "category.Office": "Escritório",
    "category.Science": "Ciência",
    "category.Settings": "Configurações",
    "category.Spreadsheet": "Planilha",
    "category.System": "Sistema",
    "category.Utility": "Utilitários",
    "category.Video": "Vídeo",
    uncategorized: "Sem categoria",
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
    downloadFailed:
      "Não foi possível baixar o repositório automaticamente. Tente novamente mais tarde.",
    downloadBundle: "Baixar bundle",
    homepage: "Homepage",
    flatpakMetadata: "Metadados Flatpak",
    applicationId: "ID da aplicação",
    installCommand: "Comando de instalação",
    noInstallCommand: "Nenhum comando de instalação Flatpak disponível",
    releaseDetails: "Detalhes da release",
    preview: "Prévia",
    screenshots: "Screenshots",
    appScreenshot: "Screenshot do app",
    previousScreenshot: "Screenshot anterior",
    nextScreenshot: "Próximo screenshot",
    screenshotNavigation: "Navegação de screenshots",
    openScreenshot: "Abrir screenshot {index}",
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
    spanish: "Espanhol",
    portuguese: "Português",
    english: "Inglês",
  },
};

const I18nContext = createContext(null);
const LOCALE_STORAGE_KEY = "slophub.locale";
const DEFAULT_LOCALE = "en";
const supportedLocales = Object.keys(dictionaries);

function getInitialLocale() {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return supportedLocales.includes(storedLocale)
    ? storedLocale
    : DEFAULT_LOCALE;
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  function setLocale(nextLocale) {
    if (!supportedLocales.includes(nextLocale)) {
      return;
    }

    setLocaleState(nextLocale);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    }
  }

  const value = useMemo(() => {
    const messages = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

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
