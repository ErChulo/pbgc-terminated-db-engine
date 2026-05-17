import { renderBsrsConfigurationPage } from "./pages/BsrsConfigurationPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderBsrsConfigurationPage(root);
