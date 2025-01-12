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

  const updateStockPrice = useCallback(() => {
    setStocks((prevStocks) => {
      const updatedStocks = prevStocks.map((stock) => {
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

      setStockHistory((prevHistory) => {
        const newHistory = { ...prevHistory };
        updatedStocks.forEach((stock) => {
          if (!newHistory[stock.symbol]) newHistory[stock.symbol] = [];
          newHistory[stock.symbol].push({
            timestamp: Date.now(),
            price: stock.price,
            volume: stock.volume,
            high: stock.dayHigh,
            low: stock.dayLow,
          });
        });
        return newHistory;
      });

      return updatedStocks;
    });
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(updateStockPrice, config.updateInterval);
  //   return () => clearInterval(interval);
  // }, [updateStockPrice, config.updateInterval]);

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
