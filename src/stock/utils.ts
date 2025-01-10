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
