import { renderCaseNavigationDashboardPage } from "./pages/CaseNavigationDashboardPage";
import { renderReconciliationWorkbenchPage } from "./pages/ReconciliationWorkbenchPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");
const appRoot = root;

function renderApp(): void {
  if (window.location.hash === "#reconciliation-workbench") {
    renderReconciliationWorkbenchPage(appRoot);
    return;
  }
  renderCaseNavigationDashboardPage(appRoot);
}

window.addEventListener("hashchange", renderApp);
renderApp();
