import { renderServiceResolutionPage } from "./pages/ServiceResolutionPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderServiceResolutionPage(root);
