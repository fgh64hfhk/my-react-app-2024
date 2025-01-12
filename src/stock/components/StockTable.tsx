import { memo } from "react";
import { Stock } from "../types";

interface StockTableProps {
  stocks: Stock[];
}

export const StockTable = memo(function StockTable({
  stocks,
}: StockTableProps) {
  console.log('StockTable rendering with stocks:', stocks); // 添加日誌以追蹤渲染
  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Symbol</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Day High</th>
          <th className="px-4 py-2">Day Low</th>
          <th className="px-4 py-2">Volume</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.symbol}>
            <td className="px-4 py-2">{stock.symbol}</td>
            <td className="px-4 py-2">{stock.price.toFixed(2)}</td>
            <td className="px-4 py-2">{stock.dayHigh.toFixed(2)}</td>
            <td className="px-4 py-2">{stock.dayLow.toFixed(2)}</td>
            <td className="px-4 py-2">{stock.volume.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
