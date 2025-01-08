// 管理股票价格和更新
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

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

// TODO 定義股票價格歷史紀錄表
// TODO 將歷史紀錄表轉換成動態圖表顯示

const initialStock = [
  { symbol: "AAPL", price: 50, priceChange: 0 },
  { symbol: "GOOG", price: 40, priceChange: 0 },
  { symbol: "AMZN", price: 20, priceChange: 0 },
  { symbol: "NVDA", price: 30, priceChange: 0 },
];

const StockProvider = ({ children }: StockProviderProps) => {
  const [stocks, setStocks] = useState<Stock[]>(initialStock);

  // Box-Muller Transform
  const generateNormalRandom = () => {
    // Box-Muller Transform 實現
    const u1 = Math.random();
    const u2 = Math.random();
    // 產生標準常態分布（平均值=0，標準差=1）的隨機數
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  // 使用 useCallback 包裹函數，避免每次渲染重新創建
  // 模擬股票價格的異步更新
  const updateStockPrice = useCallback(() => {
    // 正態分布模擬基礎波動率
    const baseVolatility = 0.02;
    // 市場負趨勢因子(降息預期減弱)
    const marketTrend = -0.001;
    // 大波動模擬
    const blackSwanProbability = 0.01; // 1% 機率發生大波動

    setStocks((prevStocks) =>
      prevStocks.map((stock) => {
        // 基礎波動（正態隨機波動）
        const randomFluctuation = generateNormalRandom() * baseVolatility;

        // 大波動（黑天鵝事件）
        let extraChange = 0;
        if (Math.random() < blackSwanProbability) {
          // 指數分布生成大波動
          const direction = Math.random() < 0.5 ? -1 : 1;
          const magnitude = -Math.log(Math.random()) * 0.05; // 指數分布
          extraChange = direction * magnitude;
        }

        // 長期正趨勢因子(Siri 發展)
        let longTermTrend = 0;
        if (stock.symbol === 'AAPL') {
          longTermTrend = 0.003;
        }

        // 累計所有變化因素
        const totalChange = randomFluctuation + longTermTrend + marketTrend + extraChange;

        let newPrice = stock.price * (1 + totalChange);

        // 跌幅反彈機制
        if ((newPrice / stock.price - 1) <= -0.05) {
          const reboundFactor = 0.02; // 反彈因子
          newPrice *= 1 + reboundFactor;
        }

        // 確保股價不低於 0.01
        newPrice = Math.max(0.01, newPrice);

        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          // 可以添加價格變動百分比供顯示
          priceChange: parseFloat(
            (((newPrice - stock.price) / stock.price) * 100).toFixed(2)
          ),
        };
      })
    );
  }, []); // 沒有依賴，所以依賴陣列為空

  useEffect(() => {
    const interval = setInterval(updateStockPrice, 500); // 每5秒更新一次價格
    return () => clearInterval(interval); // 清除定時器
  }, [updateStockPrice]); // 添加依賴，避免 ESLint 警告

  return (
    <StockContext.Provider value={{ stocks, updateStockPrice }}>
      {children}
    </StockContext.Provider>
  );
};

export { StockProvider, StockContext };
