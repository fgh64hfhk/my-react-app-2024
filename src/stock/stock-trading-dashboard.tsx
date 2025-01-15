import React, { createContext, useContext, useReducer, useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

// 創建 Context
const StockContext = createContext();

// 模擬股票數據
const initialStocks = [
  { id: 'AAPL', name: '蘋果', price: 150 },
  { id: 'GOOGL', name: '谷歌', price: 2800 },
  { id: 'TSLA', name: '特斯拉', price: 900 },
];

// 投資組合 reducer
const portfolioReducer = (state, action) => {
  switch (action.type) {
    case 'BUY':
      return {
        ...state,
        cash: state.cash - action.price,
        holdings: {
          ...state.holdings,
          [action.stockId]: (state.holdings[action.stockId] || 0) + 1
        }
      };
    default:
      return state;
  }
};

// 主要應用組件
const StockTradingDashboard = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [priceHistory, setPriceHistory] = useState({});

  // 使用 useReducer 管理投資組合
  const [portfolio, dispatch] = useReducer(portfolioReducer, {
    cash: 10000,
    holdings: {}
  });

  // 模擬股票價格更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          price: stock.price * (1 + (Math.random() - 0.5) * 0.02)
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 更新價格歷史
  useEffect(() => {
    setPriceHistory(prev => {
      const newHistory = { ...prev };
      stocks.forEach(stock => {
        if (!newHistory[stock.id]) {
          newHistory[stock.id] = [];
        }
        newHistory[stock.id] = [...newHistory[stock.id], {
          time: new Date().toLocaleTimeString(),
          price: stock.price
        }].slice(-10);
      });
      return newHistory;
    });
  }, [stocks]);

  // 計算總資產
  const totalValue = useMemo(() => {
    return stocks.reduce((total, stock) => {
      const quantity = portfolio.holdings[stock.id] || 0;
      return total + stock.price * quantity;
    }, portfolio.cash);
  }, [stocks, portfolio]);

  // 購買股票的回調函數
  const handleBuy = useCallback((stockId, price) => {
    if (portfolio.cash >= price) {
      dispatch({ type: 'BUY', stockId, price });
    }
  }, [portfolio.cash]);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>股票交易儀表板</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="text-lg font-bold">
                現金餘額: ${portfolio.cash.toFixed(2)}
              </div>
              <div className="text-lg font-bold">
                總資產: ${totalValue.toFixed(2)}
              </div>
              {stocks.map(stock => (
                <Card key={stock.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{stock.name}</h3>
                      <p className="text-sm text-gray-500">{stock.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${stock.price.toFixed(2)}</p>
                      <p className="text-sm">
                        持有: {portfolio.holdings[stock.id] || 0} 股
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleBuy(stock.id, stock.price)}
                      disabled={portfolio.cash < stock.price}
                    >
                      購買
                    </Button>
                  </div>
                  {priceHistory[stock.id] && (
                    <div className="mt-4 h-32">
                      <LineChart
                        width={300}
                        height={100}
                        data={priceHistory[stock.id]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#8884d8" 
                          dot={false} 
                        />
                      </LineChart>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockTradingDashboard;
