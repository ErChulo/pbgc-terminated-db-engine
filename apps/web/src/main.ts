import { renderCaseNavigationDashboardPage } from "./pages/CaseNavigationDashboardPage";
import { renderPromptLibraryPage } from "./pages/PromptLibraryPage";
import { renderReconciliationWorkbenchPage } from "./pages/ReconciliationWorkbenchPage";
import { renderSchemaLibraryPage } from "./pages/SchemaLibraryPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");
const appRoot = root;

function renderApp(): void {
  if (window.location.hash === "#reconciliation-workbench") {
    renderReconciliationWorkbenchPage(appRoot);
    return;
  }
  if (window.location.hash === "#prompt-library") {
    renderPromptLibraryPage(appRoot);
    return;
  }
  if (window.location.hash === "#schema-library") {
    renderSchemaLibraryPage(appRoot);
    return;
  }
  renderCaseNavigationDashboardPage(appRoot);
}

window.addEventListener("hashchange", renderApp);
renderApp();
