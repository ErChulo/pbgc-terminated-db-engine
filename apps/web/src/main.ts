import { renderCaseNavigationDashboardPage } from "./pages/CaseNavigationDashboardPage";
import { renderPbgcTemplateLibraryPage } from "./pages/PbgcTemplateLibraryPage";
import { renderPromptLibraryPage } from "./pages/PromptLibraryPage";
import { renderReconciliationWorkbenchPage } from "./pages/ReconciliationWorkbenchPage";
import { renderReviewedInputApprovalPage } from "./pages/ReviewedInputApprovalPage";
import { renderSampleMockPackManagementPage } from "./pages/SampleMockPackManagementPage";
import { renderSchemaLibraryPage } from "./pages/SchemaLibraryPage";
import { renderTemplateFillingExportPage } from "./pages/TemplateFillingExportPage";
import { renderUnresolvedIssuesQueuePage } from "./pages/UnresolvedIssuesQueuePage";
import { renderUploadImportPipelinePage } from "./pages/UploadImportPipelinePage";
import { renderDateResolutionPage } from "./pages/DateResolutionPage";
import { renderServiceResolutionPage } from "./pages/ServiceResolutionPage";
import { renderCompensationResolutionPage } from "./pages/CompensationResolutionPage";
import { renderFormResolutionPage } from "./pages/FormResolutionPage";
import { renderBenefitKernelPage } from "./pages/BenefitKernelPage";
import { renderV1VeOutputPage } from "./pages/V1VeOutputPage";
import { renderValuationListingsOutputPage } from "./pages/ValuationListingsOutputPage";
import { renderBsrsConfigurationPage } from "./pages/BsrsConfigurationPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");
const appRoot = root;

const topbarRoot = document.querySelector<HTMLElement>("#app-topbar");
if (!topbarRoot) throw new Error("Missing topbar root");

const sidebarRoot = document.querySelector<HTMLElement>("#app-sidebar");
if (!sidebarRoot) throw new Error("Missing sidebar root");

/* ── Theme System ── */

const THEME_KEY = "pbgc-engine-theme";
const LIGHT_THEME = "bone-light";
const DARK_THEME = "pure-dark";

function getStoredTheme(): string {
  return localStorage.getItem(THEME_KEY) || LIGHT_THEME;
}

function storeTheme(theme: string): void {
  localStorage.setItem(THEME_KEY, theme);
}

function applyTheme(theme: string): void {
  document.documentElement.setAttribute("data-theme", theme);
  storeTheme(theme);
}

function toggleTheme(): void {
  const current = document.documentElement.getAttribute("data-theme") || LIGHT_THEME;
  const next = current === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  applyTheme(next);
  renderNav(); // re-render to update toggle icon
}

/* ── Navigation ── */

interface NavItem {
  hash: string;
  label: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    section: "Engine",
    items: [
      { hash: "#date-resolution", label: "Date Resolution" },
      { hash: "#service-resolution", label: "Service Resolution" },
      { hash: "#compensation-resolution", label: "Compensation Resolution" },
      { hash: "#form-resolution", label: "Form Resolution" },
      { hash: "#benefit-kernel", label: "Benefit Kernel" },
      { hash: "#v1-ve-output", label: "V1 / VE Output" },
      { hash: "#valuation-listings", label: "Valuation Listings" },
      { hash: "#bsrs-configuration", label: "BSRS Configuration" },
    ],
  },
  {
    section: "Workbench",
    items: [
      { hash: "#reconciliation-workbench", label: "Reconciliation Workbench" },
      { hash: "#unresolved-issues", label: "Unresolved Issues Queue" },
    ],
  },
  {
    section: "Tools",
    items: [
      { hash: "#prompt-library", label: "Prompt Library" },
      { hash: "#schema-library", label: "Schema Library" },
      { hash: "#template-library", label: "PBGC Template Library" },
      { hash: "#upload-import", label: "Upload / Import Pipeline" },
      { hash: "#reviewed-input-approval", label: "Reviewed Input Approval" },
      { hash: "#template-filling-export", label: "Template Filling & Export" },
      { hash: "#sample-mock-packs", label: "Sample Mock Packs" },
    ],
  },
];

function getActiveHash(): string {
  return window.location.hash;
}

/* ── Logo SVG (placeholder) ── */
const LOGO_SVG = `<svg class="app-topbar-logo-svg" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="32" height="32" rx="6" fill="#155e75"/>
  <rect x="1" y="1" width="30" height="30" rx="5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="16" y="21.5" text-anchor="middle" fill="white" font-size="16" font-weight="700" font-family="system-ui">P</text>
</svg>`;

/* ── Menu SVG (hamburger for mobile) ── */
const MENU_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

/* ── Theme Toggle SVGs ── */
const SUN_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const MOON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function renderNav(): void {
  const activeHash = getActiveHash();
  const isActive = (hash: string) => activeHash === hash;
  const currentTheme = document.documentElement.getAttribute("data-theme") || LIGHT_THEME;
  const isDark = currentTheme === DARK_THEME;

  // ── Top bar ──
  topbarRoot!.innerHTML = `
    <div class="app-topbar-inner">
      <button class="sidebar-toggle-btn" id="sidebar-toggle" title="Toggle navigation" aria-label="Toggle navigation">
        ${MENU_SVG}
      </button>
      <a class="app-topbar-brand" href="/" title="PBGC Terminated DB Engine">
        ${LOGO_SVG}
        <span class="app-topbar-brand-text">
          PBGC Engine
          <span class="app-topbar-brand-sub">Terminated DB Casework</span>
        </span>
      </a>
      <button class="theme-toggle-btn" id="theme-toggle" title="${isDark ? "Switch to light theme" : "Switch to dark theme"}" aria-label="Toggle theme">
        ${isDark ? SUN_SVG : MOON_SVG}
      </button>
    </div>
  `;

  // ── Sidebar ──
  if (sidebarRoot) {
    sidebarRoot.innerHTML = `
      <div class="app-sidebar-inner">
        <a class="app-sidebar-home${isActive("") ? " is-active" : ""}" href="#">Dashboard</a>
        ${NAV_SECTIONS.map(
          (section) => `
          <span class="app-sidebar-section">${section.section}</span>
          ${section.items
            .map(
              (item) =>
                `<a class="app-sidebar-link${isActive(item.hash) ? " is-active" : ""}" href="${item.hash}">${item.label}</a>`
            )
            .join("")}
        `
        ).join("")}
      </div>
    `;
  }

  // ── Backdrop ──
  let backdrop = document.getElementById("app-sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "app-sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  // ── Event listeners ──
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

  function closeSidebar(): void {
    sidebarRoot?.classList.remove("is-open");
    backdrop?.classList.remove("is-visible");
  }

  function openSidebar(): void {
    sidebarRoot?.classList.add("is-open");
    backdrop?.classList.add("is-visible");
  }

  function toggleSidebar(): void {
    if (sidebarRoot?.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  const sidebarToggleBtn = document.getElementById("sidebar-toggle");
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", toggleSidebar);
  }

  // Close sidebar on backdrop click
  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }

  // Close sidebar on link click
  if (sidebarRoot) {
    sidebarRoot.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeSidebar);
    });
  }
}

function renderApp(): void {
  renderNav();

  const hash = window.location.hash;
  if (hash === "#reconciliation-workbench") {
    renderReconciliationWorkbenchPage(appRoot);
    return;
  }
  if (hash === "#prompt-library") {
    renderPromptLibraryPage(appRoot);
    return;
  }
  if (hash === "#schema-library") {
    renderSchemaLibraryPage(appRoot);
    return;
  }
  if (hash === "#template-library") {
    renderPbgcTemplateLibraryPage(appRoot);
    return;
  }
  if (hash === "#upload-import") {
    renderUploadImportPipelinePage(appRoot);
    return;
  }
  if (hash === "#reviewed-input-approval") {
    renderReviewedInputApprovalPage(appRoot);
    return;
  }
  if (hash === "#template-filling-export") {
    renderTemplateFillingExportPage(appRoot);
    return;
  }
  if (hash === "#unresolved-issues") {
    renderUnresolvedIssuesQueuePage(appRoot);
    return;
  }
  if (hash === "#sample-mock-packs") {
    renderSampleMockPackManagementPage(appRoot);
    return;
  }
  if (hash === "#date-resolution") {
    renderDateResolutionPage(appRoot);
    return;
  }
  if (hash === "#service-resolution") {
    renderServiceResolutionPage(appRoot);
    return;
  }
  if (hash === "#compensation-resolution") {
    renderCompensationResolutionPage(appRoot);
    return;
  }
  if (hash === "#form-resolution") {
    renderFormResolutionPage(appRoot);
    return;
  }
  if (hash === "#benefit-kernel") {
    renderBenefitKernelPage(appRoot);
    return;
  }
  if (hash === "#v1-ve-output") {
    renderV1VeOutputPage(appRoot);
    return;
  }
  if (hash === "#valuation-listings") {
    renderValuationListingsOutputPage(appRoot);
    return;
  }
  if (hash === "#bsrs-configuration") {
    renderBsrsConfigurationPage(appRoot);
    return;
  }
  renderCaseNavigationDashboardPage(appRoot);
}

/* ── Bootstrap ── */

// Apply stored theme before first render
const storedTheme = getStoredTheme();
applyTheme(storedTheme);

window.addEventListener("hashchange", renderApp);
renderApp();
