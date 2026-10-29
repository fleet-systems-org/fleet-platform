import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./app/styles.css";
import "./app/variant-proposals.css";
import "./review/prototype.css";
import "./review/mostek.css";
import "./review/comments.js";
import "./review/prototype.js";

createRoot(document.getElementById("root")!).render(<App />);
