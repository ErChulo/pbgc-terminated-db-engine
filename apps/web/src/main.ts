import { renderValuationListingsOutputPage } from "./pages/ValuationListingsOutputPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderValuationListingsOutputPage(root);
