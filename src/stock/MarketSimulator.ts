import { SimulationConfig, MarketEvent } from "./types";
import { generateNormalRandom } from "./utils";

export class MarketSimulator {
  private volatilityMap: { [key: string]: number };
  private sectorCorrelations: { [key: string]: string[] };
  private marketMood: number;
  private activeEvents: MarketEvent[];
  private config: SimulationConfig;

  constructor(config: SimulationConfig) {
    this.volatilityMap = {
      AAPL: 0.02,
      GOOG: 0.025,
      AMZN: 0.03,
      NVDA: 0.035,
    };

    this.sectorCorrelations = {
      TECH: ["AAPL", "GOOG"],
      ECOM: ["AMZN"],
      SEMI: ["NVDA"],
    };

    this.marketMood = 0.2;
    
    // TODO
    this.activeEvents = [];

    // default
    this.config = config;
  }

  private generateVolatility(baseVolatility: number): number {
    return generateNormalRandom(0, baseVolatility);
  }

  addMarketEvent(event: MarketEvent) {
    this.activeEvents.push(event);
  }

  calculateEventImpact(symbol: string): number {
    return this.activeEvents
      .filter((event) => event.affectedSymbols.includes(symbol))
      .reduce((total, event) => total + event.impact, 0);
  }

  calculatePriceChange(
    symbol: string,
    currentPrice: number
  ): { newPrice: number; volume: number; high: number; low: number } {
    const baseVolatility = this.volatilityMap[symbol] || 0.02;
    const marketImpact = this.marketMood * this.config.marketTrendStrength;
    const eventImpact = this.calculateEventImpact(symbol);
    const randomVolatility = this.generateVolatility(baseVolatility);

    let blackSwanEffect = 0;
    if (Math.random() < this.config.blackSwanProbability) {
      const direction = Math.random() < 0.5 ? -1 : 1;
      blackSwanEffect =
        direction * Math.abs(generateNormalRandom(0, baseVolatility * 5));
    }

    const totalChange =
      randomVolatility + marketImpact + eventImpact + blackSwanEffect;

    let newPrice = currentPrice * (1 + totalChange);
    if (newPrice / currentPrice - 1 <= -0.05) {
      const reboundFactor = 0.02;
      newPrice *= 1 + reboundFactor;
    }

    newPrice = Math.max(0.01, parseFloat(newPrice.toFixed(2)));
    const volumeMultiplier = 1 + Math.abs(totalChange) * 10;
    const volume = Math.floor(10000 * volumeMultiplier);

    return {
      newPrice,
      volume,
      high: Math.max(currentPrice, newPrice),
      low: Math.min(currentPrice, newPrice),
    };
  }
}
