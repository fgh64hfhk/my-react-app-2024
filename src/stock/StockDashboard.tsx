import React, { useContext, useEffect, useLayoutEffect } from "react";
import { StockContext } from "./StockContext";
import { StockTable } from "./components/StockTable";
import StockChart from "./StockChart";
// import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useMarketSimulation } from "./hooks/useMarketSimulation";

import "./StockChart.css";

export const StockDashboard: React.FC = () => {
  const stockContext = useContext(StockContext);

  if (!stockContext) {
    return <div>Error: StockContext is not available</div>;
  }

  const {
    stocks,
    stockHistory,
    config,
    addMarketEvent,
    setSimulationConfig,
    updateStockPrice,
  } = stockContext;

  // 使用自定義 Hook 處理市場模擬配置
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMarketSimulation(addMarketEvent, setSimulationConfig);

  // 處理價格更新
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      if (isMounted) {
        updateStockPrice();
      }
    }, config.updateInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [updateStockPrice, config.updateInterval]);

  // 模擬配置（建議移到 useEffect 中）
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // 為了避免重複設置，可以添加一個標記
    const isConfigured = sessionStorage.getItem("marketConfigured");

    if (!isConfigured) {
      // 添加市場事件
      addMarketEvent({
        type: "news",
        impact: 0.05,
        duration: 1000,
        affectedSymbols: ["AAPL", "GOOG"],
      });

      // 調整模擬配置
      setSimulationConfig({
        updateInterval: 1000,
        volatilityRange: [0.02, 0.05],
        blackSwanProbability: 0.02,
        marketTrendStrength: 0.008,
        enableSectorCorrelation: true,
      });

      // 設置標記避免重複配置
      sessionStorage.setItem("marketConfigured", "true");
    }
  }, [addMarketEvent, setSimulationConfig]); // 只在組件掛載時執行

  return (
    <div>
      <h1>Stock Dashboard</h1>

      <ErrorBoundary>
        <div>
          <h2>Stock Table</h2>
          <StockTable stocks={stocks} />
        </div>

        <div className="stock-app">
          <h2>Real-time Stock Charts</h2>
          <div className="stock-grid">
            {Object.entries(stockHistory).map(([symbol, history]) => (
              <div key={symbol} className="stock-item">
                <StockChart symbol={symbol} history={history} />
              </div>
            ))}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default StockDashboard;
