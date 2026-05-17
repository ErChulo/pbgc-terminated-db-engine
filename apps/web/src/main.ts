import { renderCompensationResolutionPage } from "./pages/CompensationResolutionPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderCompensationResolutionPage(root);
