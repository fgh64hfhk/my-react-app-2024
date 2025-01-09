import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";
import { onCLS, onINP, onLCP, Metric } from "web-vitals";

import "./stock/StockChart.css"

// Router
import NavigateRouter from "./router/NavigateRouter.tsx";
import { BrowserRouter } from "react-router-dom";

function sendToAnalytics(metric: Metric) {
  // 这里可以将数据发送到你的分析服务
  console.log("Web Vitals Metric:", metric);
  // const body = JSON.stringify(metric);
  // fetch("http://localhost:8080/React-backend/pref", {
  //   body,
  //   method: "POST",
  //   keepalive: true,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
}

// 收集 Web Vitals 并将其发送到分析服务
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NavigateRouter />
    </BrowserRouter>
  </StrictMode>
);
