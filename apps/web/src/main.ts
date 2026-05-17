import { renderBenefitKernelPage } from "./pages/BenefitKernelPage";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Missing app root");

renderBenefitKernelPage(root);
