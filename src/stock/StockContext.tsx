import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Stock, StockHistory, MarketEvent, SimulationConfig } from "./types";
import { MarketSimulator } from "./MarketSimulator";
import { initialStocks, initialConfig } from "./initialData";

// eslint-disable-next-line react-refresh/only-export-components
export const StockContext = createContext<{
  stocks: Stock[];
  stockHistory: StockHistory;
  config: SimulationConfig;
  updateStockPrice: () => void;
  addMarketEvent: (event: MarketEvent) => void;
  setSimulationConfig: (config: SimulationConfig) => void;
} | null>(null);

export const StockProvider = ({ children }: { children: React.ReactNode }) => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [stockHistory, setStockHistory] = useState<StockHistory>({});
  const [config, setConfig] = useState<SimulationConfig>(initialConfig);
  const marketSimulator = useRef(new MarketSimulator(config));

  const updateTimeRef = useRef<Record<string, number>>({});
  const batchRef = useRef<number>(0);

  const updateStockPrice = useCallback(() => {
    const now = Date.now();
    const currentBatch = Math.floor(now / 1000);

    // 更精確的批次控制
    if (currentBatch === batchRef.current) {
      console.debug("Skipping update in same batch");
      return;
    }
    batchRef.current = currentBatch;

    setStocks((prevStocks) => {
      const updatedStocks = prevStocks.map((stock) => {
        // 檢查每個股票的最後更新時間
        if (
          now - (updateTimeRef.current[stock.symbol] || 0) <
          config.updateInterval
        ) {
          return stock; // 跳過此股票的更新
        }
        updateTimeRef.current[stock.symbol] = now;

        const { newPrice, volume, high, low } =
          marketSimulator.current.calculatePriceChange(
            stock.symbol,
            stock.price
          );
        return {
          ...stock,
          price: newPrice,
          volume,
          dayHigh: high,
          dayLow: low,
        };
      });

      // 只有當有實際更新時才更新歷史記錄
      const hasUpdates = updatedStocks.some(
        (stock, i) => stock.price !== prevStocks[i].price
      );

      if (hasUpdates) {
        setStockHistory((prevHistory) => {
          const newHistory = { ...prevHistory };
          const MAX_HISTORY = 99;
          updatedStocks.forEach((stock) => {
            if (!newHistory[stock.symbol]) {
              newHistory[stock.symbol] = [];
            }
            // 確保不重複添加相同時間戳的數據
            const lastEntry =
              newHistory[stock.symbol][newHistory[stock.symbol].length - 1];
            if (!lastEntry || lastEntry.timestamp !== now) {
              newHistory[stock.symbol] = [
                ...newHistory[stock.symbol].slice(-MAX_HISTORY), // 保持最新的 99 條記錄
                {
                  timestamp: now,
                  price: stock.price,
                  volume: stock.volume,
                  high: stock.dayHigh,
                  low: stock.dayLow,
                },
              ];
            }
          });
          return newHistory;
        });
      }

      return hasUpdates ? updatedStocks : prevStocks;
    });
  }, [config.updateInterval]);

  // 3. 添加更詳細的監控日誌
  useEffect(() => {
    console.log("History update triggered by:", {
      timestamp: new Date().toISOString(),
      arrayLengths: Object.entries(stockHistory).map(([symbol, history]) => ({
        symbol,
        length: history.length,
        lastUpdate: history[history.length - 1]?.timestamp,
        timeSinceLastUpdate:
          Date.now() - (history[history.length - 1]?.timestamp || 0),
      })),
    });
  }, [stockHistory]);

  useEffect(() => {
    marketSimulator.current = new MarketSimulator(config);
  }, [config]);

  return (
    <StockContext.Provider
      value={{
        stocks,
        stockHistory,
        config,
        updateStockPrice,
        addMarketEvent: marketSimulator.current.addMarketEvent.bind(
          marketSimulator.current
        ),
        setSimulationConfig: setConfig,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};
