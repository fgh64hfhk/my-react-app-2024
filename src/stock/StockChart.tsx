import React, { useRef, useMemo, useEffect } from "react";
import * as d3 from "d3";

interface StockChartProps {
  history: { timestamp: number; price: number }[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ history, symbol }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);

  // console.log("Chart FC: ", history.length);

  // 圖表尺寸
  const dimensions = useMemo(
    () => ({
      width: 500,
      height: 300,
      margin: { top: 20, right: 30, bottom: 30, left: 40 },
    }),
    []
  );

  // 比例尺
  const scales = useMemo(() => {
    // console.log("useMemo for scales: 1 -> ", dimensions);
    const x = d3
      .scaleTime()
      .domain(d3.extent(history, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([
        dimensions.margin.left,
        dimensions.width - dimensions.margin.right,
      ]);

    const y = d3
      .scaleLinear()
      .domain([
        (d3.min(history, (d) => d.price) ?? 0) * 0.95,
        (d3.max(history, (d) => d.price) ?? 0) * 1.05,
      ])
      .nice()
      .range([
        dimensions.height - dimensions.margin.bottom,
        dimensions.margin.top,
      ]);

    return { x, y };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions, history, history.length]);

  // 初始化圖表
  useEffect(() => {
    // console.log("useEffect for init: 2 -> ", dimensions);
    const svg = d3.select(chartRef.current);

    // 清空並初始化
    svg.selectAll("*").remove();

    // 路徑
    const path = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);
    pathRef.current = path.node();

    // 坐標軸
    const xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(0,${dimensions.height - dimensions.margin.bottom})`
      );

    const yAxis = svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${dimensions.margin.left},0)`);

    xAxisRef.current = xAxis.node();
    yAxisRef.current = yAxis.node();
  }, [dimensions]);

  // 更新圖表
  useEffect(() => {
    // console.log("useEffect for update: 3 -> ", scales);
    if (!pathRef.current || !xAxisRef.current || !yAxisRef.current) return;

    // 更新路徑
    const line = d3
      .line<{ timestamp: number; price: number }>()
      .x((d) => scales.x(new Date(d.timestamp)))
      .y((d) => scales.y(d.price))
      .curve(d3.curveCardinal.tension(1));

    d3.select(pathRef.current)
      .datum(history)
      // .transition()
      // .duration(300)
      .attr("d", line);

    // 更新 X 軸
    d3.select(xAxisRef.current)
      .transition()
      .duration(300)
      .call(
        d3
          .axisBottom(scales.x)
          .tickFormat((d) => d3.timeFormat("%H:%M")(new Date(d as number)))
      );

    // 更新 Y 軸
    d3.select(yAxisRef.current)
      .transition()
      .duration(300)
      .call(d3.axisLeft(scales.y));
  }, [scales, history, history.length]);

  return (
    <div className="stock-chart">
      <h3>{symbol} Stock Price</h3>
      <svg
        ref={chartRef}
        width={dimensions.width}
        height={dimensions.height}
      ></svg>
      {!history.length && <div>Waiting for data...</div>}
    </div>
  );
};

export default StockChart;
