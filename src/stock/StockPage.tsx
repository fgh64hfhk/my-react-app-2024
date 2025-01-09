import StockChart from "./StockChart";
import { useContext } from "react";
import { StockContext, StockProvider } from "./StockProvider";

const StockPage = () => {
  const context = useContext(StockContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const { stockHistory } = context;

  return (
    <div className="stock-grid">
      {Object.keys(stockHistory).map((symbol) => (
        <div key={symbol} className="stock-item">
          <StockChart symbol={symbol} history={stockHistory[symbol]} />
        </div>
      ))}
    </div>
  );
};

// 樹根組件
function StockChartApp() {
  return (
    <StockProvider>
      <div className="stock-app">
        <h1>Real-time Stock Charts</h1>
        <StockPage />
      </div>
    </StockProvider>
  );
}

export default StockChartApp;
