import { renderReconciliationWorkbenchPage } from "./pages/ReconciliationWorkbenchPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderReconciliationWorkbenchPage(root);
