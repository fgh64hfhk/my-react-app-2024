export interface Stock {
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  technicalIndicators: {
    ma20: number;
    rsi: number;
  };
}

export interface StockHistory {
  [symbol: string]: {
    timestamp: number;
    price: number;
    volume: number;
    high: number;
    low: number;
  }[];
}

export interface MarketEvent {
  type: "news" | "earnings" | "macro";
  impact: number;
  duration: number;
  affectedSymbols: string[];
}

export interface SimulationConfig {
  updateInterval: number;
  volatilityRange: [number, number];
  blackSwanProbability: number;
  marketTrendStrength: number;
  enableSectorCorrelation: boolean;
}
