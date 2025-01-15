export function generateNormalRandom(mean = 0, stdDev = 1): number {
  let u1, u2, z0;
  do {
    u1 = Math.random();
    u2 = Math.random();
  } while (u1 <= Number.EPSILON);

  // eslint-disable-next-line prefer-const
  z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

export function calculateBeta(
  stockReturns: number[],
  marketReturns: number[]
): number {
  if (
    stockReturns.length !== marketReturns.length ||
    stockReturns.length === 0
  ) {
    throw new Error("Invalid return data");
  }

  // 計算協方差
  const avgStockReturn =
    stockReturns.reduce((a, b) => a + b) / stockReturns.length;
  const avgMarketReturn =
    marketReturns.reduce((a, b) => a + b) / marketReturns.length;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < stockReturns.length; i++) {
    const stockDiff = stockReturns[i] - avgStockReturn;
    const marketDiff = marketReturns[i] - avgMarketReturn;

    covariance += stockDiff * marketDiff;
    marketVariance += marketDiff * marketDiff;
  }

  covariance /= stockReturns.length;
  marketVariance /= marketReturns.length;

  // Beta = 協方差 / 市場報酬變異數
  return covariance / marketVariance;
}

// 輔助函數：計算移動平均
export function calculateMA(data: number[], period: number): number[] {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

// 輔助函數：計算標準差
export function calculateStandardDeviation(data: number[]): number {
  const mean = data.reduce((a, b) => a + b) / data.length;
  const squaredDiffs = data.map((value) => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / data.length;
  return Math.sqrt(variance);
}
