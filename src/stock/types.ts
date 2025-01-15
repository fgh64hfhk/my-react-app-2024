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

export interface HistoricalData {
  timestamp: Date;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface TradingStrategy {
  name: string;
  description: string;
  // 策略參數
  parameters: {
    entryThreshold: number;
    exitThreshold: number;
    stopLoss: number;
    maxPositionSize: number;
  };
  // 策略條件函數
  shouldEnter: (data: HistoricalData[], currentPrice: number) => boolean;
  shouldExit: (data: HistoricalData[], currentPrice: number) => boolean;
  // 倉位大小計算
  calculatePositionSize: (
    capital: number,
    price: number,
    risk: number
  ) => number;
  // 風險管理函數
  calculateRisk: (entryPrice: number, currentPrice: number) => number;
}

export interface SectorInfo {
  // 產業整理表現
  performance: {
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearToDateReturn: number;
  };
  // 產業波動性指標
  volatility: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  // 動能指標
  momentum: {
    shortTerm: number; // 5日
    mediumTerm: number; // 20日
    longTerm: number; // 60日
  };
  // 主導股票資訊
  dominantSymbol: {
    symbol: string;
    weight: number;
    correlation: number;
  };
  // 產業成分股
  components: string[];
  // 產業資金流向
  capitalFlow: {
    institutional: number;
    retail: number;
    foreign: number;
  };
}

export interface RiskMetrics {
  // 波動率
  volatility: number;
  // Beta係數
  beta: number;
  // 夏普比率
  sharpeRatio: number;
  // 最大回撤
  maxDrawdown: number;
  // 其他風險指標
  valueAtRisk?: number; // VaR
  expectedShortfall?: number; // 預期虧損
  informationRatio?: number; // 信息比率
  treynorRatio?: number; // 崔納比率
}

// 新增的類型定義
export interface VolumeProfile {
  volume: number;
  high: number;
  low: number;
  averageVolume?: number;
  volumeSpikes?: number[];
}

export interface StrategyPerformance {
  returns: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}