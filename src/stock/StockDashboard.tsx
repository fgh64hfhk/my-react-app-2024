import { useContext } from "react";
import { StockContext } from "./StockContext";
import StockChart from "./StockChart";

const StockDashboard = () => {
  const stockContext = useContext(StockContext);

  if (!stockContext) {
    return <div>Error: StockContext is not available</div>;
  }

  const { stocks, stockHistory, addMarketEvent, setSimulationConfig } =
    stockContext;

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
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.price}</td>
              <td>{stock.dayHigh}</td>
              <td>{stock.dayLow}</td>
              <td>{stock.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="stock-app">
        <h1>Real-time Stock Charts</h1>
        <div className="stock-grid">
          {Object.keys(stockHistory).map((symbol) => (
            <div key={symbol} className="stock-item">
              <StockChart symbol={symbol} history={stockHistory[symbol]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
