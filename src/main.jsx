import React from "react";
import ReactDOM from "react-dom/client";
import UngDung from "./App";
import "./index.css";

const gocReact = ReactDOM.createRoot(document.getElementById("root"));
// Root React gan vao phan tu HTML co id root.

gocReact.render(
  <React.StrictMode>
    <UngDung />
  </React.StrictMode>
);
