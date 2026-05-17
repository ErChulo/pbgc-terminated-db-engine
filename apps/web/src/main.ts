import { renderDateResolutionPage } from "./pages/DateResolutionPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderDateResolutionPage(root);
