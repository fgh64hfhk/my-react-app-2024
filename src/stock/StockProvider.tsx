// 管理股票价格和更新
import { createContext, ReactNode, useEffect, useState } from "react";

// 股票數據結構
interface Stock {
  symbol: string;
  price: number;
}

// 提供股票數據的上下文
const StockContext = createContext<{
  stocks: Stock[];
  updateStockPrice: () => void;
} | undefined>(undefined);

// 定義 Props 的類型
interface StockProviderProps {
  children: ReactNode;
}

const StockProvider = ({ children }: StockProviderProps) => {
  const [stocks, setStocks] = useState<Stock[]>([
    { symbol: "AAPL", price: 150 },
    { symbol: "GOOG", price: 2800 },
    { symbol: "AMZN", price: 3400 },
  ]);

  // 模擬股票價格的異步更新
  const updateStockPrice = () => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) => ({
        ...stock,
        price: Math.max(0, stock.price + (Math.random() - 0.5) * 10), // 限制價格為正數
      }))
    );
  };

  useEffect(() => {
    const interval = setInterval(updateStockPrice, 5000); // 每5秒更新一次價格
    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <StockContext.Provider value={{ stocks, updateStockPrice }}>
      {children}
    </StockContext.Provider>
  );
};

export { StockProvider, StockContext };