import React, { useContext, useMemo, useEffect } from "react";
import { StockContext } from "./StockContext";
import StockChart from "./StockChart";

const StockDashboard: React.FC = () => {
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const interval = setInterval(updateStockPrice, config.updateInterval);
    return () => clearInterval(interval);
  }, [updateStockPrice, config.updateInterval]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log("History update:", stockHistory); // 添加日誌
  }, [stockHistory]);

  // 緩存股票表格數據
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const stockTableRows = useMemo(
    () =>
      stocks.map((stock) => (
        <tr key={stock.symbol}>
          <td>{stock.symbol}</td>
          <td>{stock.price}</td>
          <td>{stock.dayHigh}</td>
          <td>{stock.dayLow}</td>
          <td>{stock.volume}</td>
        </tr>
      )),
    [stocks]
  );

  return (
    <div>
      <h1>Stock Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Day High</th>
            <th>Day Low</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>{stockTableRows}</tbody>
      </table>

      <div className="stock-app">
        <h1>Real-time Stock Charts</h1>
        <div className="stock-grid">
          {Object.entries(stockHistory).map(([symbol, history]) => (
            <div key={symbol} className="stock-item">
              <StockChart symbol={symbol} history={history} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
