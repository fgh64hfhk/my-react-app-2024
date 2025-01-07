// 管理用户资产和交易操作
import { useContext, useMemo, useReducer } from "react";
import { StockProvider, StockContext } from "./StockProvider";

// 主組件的邏輯
function StockTrading() {
  // 初始化帳戶資金
  const initialBalance = 10000;
  // 初始化帳戶資訊
  const initialAccount = {
    balance: initialBalance,
    portfolio: {
        "AAPL": 5,
        "AMZN": 10,
    }
  }
  // 1. 使用上下文取得股票資訊
  const { stocks } = useContext(StockContext) || { stocks: [] };
  // 2. 初始化 Reducer
  const [account] = useReducer(portfolioReducer, initialAccount);
  // 3. 計算投資組合的總價值
  const totalValue = useMemo(() => {
    return Object.entries(account.portfolio).reduce((total, [s, amount]) => {
        const stock = stocks.find(({ symbol }) => symbol === s);
        return stock ? total + (stock.price * amount) : total;
    }, 0);
  }, [stocks, account]);
  console.log(stocks);
  return (
    <>
        <h1>股票交易系統</h1>
        <div>
            <h2>股票列表</h2>
            <ul>
                {stocks.map((stock) => (
                    <li>
                        <span>{stock.symbol}: ${stock.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div>投資組合價值</div>
        <p>{totalValue} USD</p>
    </>
  );
}

// 匯出的整合組件
function StockTradingApp() {
    return (
        <StockProvider>
            <StockTrading />
        </StockProvider>
    )
}

// 定義投資組合狀態和動作
interface PortfolioState {
  balance: number; // 用戶當前餘額
  portfolio: {
    [symbol: string]: number; // 每個股票符號對應的持有數量
  };
}
interface Action {
  type: "BUY" | "SELL"; // 動作類型:買入或賣出
  payload: {
    symbol: string; // 股票符號
    amount: number; // 賣出或買入的數量
    price?: number; // 股票價格，用於計算交易金額
  };
}
// 定義 Reducer
const portfolioReducer = (
  state: PortfolioState,
  action: Action
): PortfolioState => {
  // 取得動作裡面的資料載體
  const { symbol, amount, price = 0 } = action.payload;
  // 計算交易金額
  const transaction = amount * price;
  // 取得持有股票的數量
  const remainder = state.portfolio[symbol];
  // 取得帳戶餘額
  const balance = state.balance;
  switch (action.type) {
    case "BUY": {
      // 如果餘額足夠則更新投資組合與餘額，反之回傳原本狀態
      if (balance >= transaction) {
        return {
          ...state,
          balance: state.balance - transaction,
          // 合併到該 symbol 部位的數量
          [symbol]: state.portfolio[symbol] + amount,
        };
      }
      return state;
    }
    case "SELL": {
      // 如果股數足夠則更新投資組合與餘額，反之回傳原本狀態
      if (remainder >= amount) {
        return {
          ...state,
          balance: state.balance + transaction,
          // 合併到該 symbol 部位的數量
          [symbol]: state.portfolio[symbol] - amount,
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default StockTradingApp;