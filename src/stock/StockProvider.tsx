// 管理股票价格和更新
import { createContext, ReactNode, useEffect, useState } from "react";

// 股票數據結構
interface Stock {
  symbol: string;
  price: number;
  priceChange: number; // 價格變動百分比
}

// 提供股票數據的上下文
const StockContext = createContext<
  | {
      stocks: Stock[];
      updateStockPrice: () => void;
    }
  | undefined
>(undefined);

// 定義 Props 的類型
interface StockProviderProps {
  children: ReactNode;
}

const StockProvider = ({ children }: StockProviderProps) => {
  const [stocks, setStocks] = useState<Stock[]>([
    { symbol: "AAPL", price: 10, priceChange: 0 },
    { symbol: "GOOG", price: 20, priceChange: 0 },
    { symbol: "AMZN", price: 30, priceChange: 0 },
  ]);

  // Box-Muller Transform
  const generateNormalRandom = () => {
    // Box-Muller Transform 實現
    const u1 = Math.random();
    const u2 = Math.random();
    // 產生標準常態分布（平均值=0，標準差=1）的隨機數
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  // 模擬股票價格的異步更新
  const updateStockPrice = () => {
    // 正態分布模擬小波動
    const baseVolatility = 0.02;
    // 大波動模擬
    const blackSwanProbability = 0.01; // 1% 機率發生大波動

    setStocks((prevStocks) =>
      prevStocks.map((stock) => {
        // 基礎波動（正態分布）
        const normalChange = generateNormalRandom() * baseVolatility;

        // 大波動（黑天鵝事件）
        let extraChange = 0;
        if (Math.random() < blackSwanProbability) {
          // 指數分布生成大波動
          const direction = Math.random() < 0.5 ? -1 : 1;
          const magnitude = -Math.log(Math.random()) * 0.05; // 指數分布
          extraChange = direction * magnitude;
        }

        // 計算價格變動
        const totalChange = normalChange + extraChange;

        // 確保新價格不會低於 0.01
        const newPrice = Math.max(0.01, stock.price * (1 + totalChange));

        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          // 可以添加價格變動百分比供顯示
          priceChange: parseFloat((((newPrice - stock.price) / stock.price) * 100).toFixed(2)),
        };
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(updateStockPrice, 500); // 每5秒更新一次價格
    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <StockContext.Provider value={{ stocks, updateStockPrice }}>
      {children}
    </StockContext.Provider>
  );
};

export { StockProvider, StockContext };
