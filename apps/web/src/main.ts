import { renderFormResolutionPage } from "./pages/FormResolutionPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderFormResolutionPage(root);
