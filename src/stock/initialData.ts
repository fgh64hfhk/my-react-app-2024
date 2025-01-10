import { Stock, SimulationConfig } from "./types";

export const initialStocks: Stock[] = [
  {
    symbol: "AAPL",
    price: 50,
    priceChange: 0,
    volume: 10000,
    dayHigh: 50,
    dayLow: 50,
    technicalIndicators: { ma20: 50, rsi: 50 },
  },
  {
    symbol: "GOOG",
    price: 40,
    priceChange: 0,
    volume: 10000,
    dayHigh: 40,
    dayLow: 40,
    technicalIndicators: { ma20: 40, rsi: 50 },
  },
  {
    symbol: "AMZN",
    price: 20,
    priceChange: 0,
    volume: 10000,
    dayHigh: 20,
    dayLow: 20,
    technicalIndicators: { ma20: 20, rsi: 50 },
  },
  {
    symbol: "NVDA",
    price: 30,
    priceChange: 0,
    volume: 10000,
    dayHigh: 30,
    dayLow: 30,
    technicalIndicators: { ma20: 30, rsi: 50 },
  },
];

export const initialConfig: SimulationConfig = {
  updateInterval: 500,
  volatilityRange: [0.01, 0.04],
  blackSwanProbability: 0.01,
  marketTrendStrength: 0.005,
  enableSectorCorrelation: true,
};
