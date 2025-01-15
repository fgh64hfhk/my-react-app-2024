import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

// import { onCLS, onINP, onLCP, Metric } from "web-vitals";

import { StockProvider } from "./stock/StockContext.tsx";

import "./index.css"

// function sendToAnalytics(metric: Metric) {
//   这里可以将数据发送到你的分析服务
//   console.log("Web Vitals Metric:", metric);
//   const body = JSON.stringify(metric);
//   fetch("http://localhost:8080/React-backend/pref", {
//     body,
//     method: "POST",
//     keepalive: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// 收集 Web Vitals 并将其发送到分析服务
// onCLS(sendToAnalytics);
// onINP(sendToAnalytics);
// onLCP(sendToAnalytics);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StockProvider>
      <App />
    </StockProvider>
  </StrictMode>
);
