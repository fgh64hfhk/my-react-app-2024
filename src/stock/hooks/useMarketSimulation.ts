import { useEffect } from "react";
import { MarketEvent, SimulationConfig } from "../types";

export function useMarketSimulation(
  addMarketEvent: (event: MarketEvent) => void,
  setSimulationConfig: (config: SimulationConfig) => void
) {
  useEffect(() => {
    const isConfigured = sessionStorage.getItem("marketConfigured");

    if (!isConfigured) {
      const initialMarketEvent: MarketEvent = {
        type: "news",
        impact: 0.05,
        duration: 1000,
        affectedSymbols: ["AAPL", "GOOG"],
      };

      const initialConfig: SimulationConfig = {
        updateInterval: 1000,
        volatilityRange: [0.02, 0.05],
        blackSwanProbability: 0.02,
        marketTrendStrength: 0.008,
        enableSectorCorrelation: true,
      };

      addMarketEvent(initialMarketEvent);
      setSimulationConfig(initialConfig);
      sessionStorage.setItem("marketConfigured", "true");
    }
  }, [addMarketEvent, setSimulationConfig]);
}
