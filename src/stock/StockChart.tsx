import React, { useRef } from "react";
import * as d3 from "d3";

import type { BaseType } from "d3-selection";
import type { Transition } from "d3-transition";
import type { NumberValue } from "d3";

// 定義更精確的型別
// type AxisSelection = Selection<SVGGElement, unknown, BaseType, unknown>;
type AxisTransition = Transition<SVGGElement, unknown, BaseType, unknown>;

interface StockChartProps {
  history: { timestamp: number; price: number }[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ history, symbol }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  //   const currentPathRef = pathRef.current;
  const currentChartRef = chartRef.current;

  //   console.log("Chart chartRef: ", currentChartRef);
  //   console.log("Chart pathRef: ", currentPathRef);

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  // 使用 D3 繪製圖表
  const svg = d3.select(currentChartRef);

  svg.selectAll("*").remove(); // 清空已有的圖表內容

  pathRef.current = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .node();

  // 添加坐標軸群組
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`);

  // 更新比例尺
  const x = d3
    .scaleTime()
    .domain(d3.extent(history, (d) => new Date(d.timestamp)) as [Date, Date])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([
      (d3.min(history, (d) => d.price) ?? 0) * 0.95, // 下限設為最低價的95%
      (d3.max(history, (d) => d.price) ?? 0) * 1.05 || 100, // 上限設為最高價的105%
    ])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // 更新坐標軸
  svg
    .select<SVGGElement>(".x-axis")
    .transition()
    .duration(300)
    .call((g: AxisTransition) => {
      const xAxis = d3.axisBottom(x).tickFormat((d: NumberValue) => {
        return d3.timeFormat("%H:%M")(new Date(d.valueOf()));
      });
      (xAxis as unknown as (selection: AxisTransition) => void)(g);
    });

  svg
    .select<SVGGElement>(".y-axis")
    .transition()
    .duration(300)
    .call((g: AxisTransition) => {
      const yAxis = d3.axisLeft(y);
      (yAxis as unknown as (selection: AxisTransition) => void)(g);
    });

  // 更新線條
  const line = d3
    .line<{ timestamp: number; price: number }>()
    .x((d) => x(new Date(d.timestamp)))
    .y((d) => y(d.price))
    .curve(d3.curveMonotoneX);

  // 使用過渡效果更新路徑
  d3.select(pathRef.current)
    .datum(history)
    .transition()
    .duration(300)
    .attr("d", line);

  return (
    <div className="stock-chart">
      <h3>{symbol} Stock Price</h3>
      <svg ref={chartRef} width={500} height={300}></svg>
    </div>
  );
};

export default StockChart;
