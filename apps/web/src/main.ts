import { renderV1VeOutputPage } from "./pages/V1VeOutputPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderV1VeOutputPage(root);
