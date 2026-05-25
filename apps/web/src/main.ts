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
  if (window.location.hash === "#template-library") {
    renderPbgcTemplateLibraryPage(appRoot);
    return;
  }
  if (window.location.hash === "#upload-import") {
    renderUploadImportPipelinePage(appRoot);
    return;
  }
  if (window.location.hash === "#reviewed-input-approval") {
    renderReviewedInputApprovalPage(appRoot);
    return;
  }
  if (window.location.hash === "#template-filling-export") {
    renderTemplateFillingExportPage(appRoot);
    return;
  }
  if (window.location.hash === "#unresolved-issues") {
    renderUnresolvedIssuesQueuePage(appRoot);
    return;
  }
  if (window.location.hash === "#sample-mock-packs") {
    renderSampleMockPackManagementPage(appRoot);
    return;
  }
  renderCaseNavigationDashboardPage(appRoot);
}

window.addEventListener("hashchange", renderApp);
renderApp();
