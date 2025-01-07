// 管理用户资产和交易操作
import { useContext, useMemo, useReducer } from "react";
import { StockProvider, StockContext } from "./StockProvider";

// 主組件的邏輯
function StockTrading() {
  // 初始化帳戶資金
  const initialBalance = 10000;
  // 初始化帳戶資訊
  const initialAccount: PortfolioState = {
    balance: initialBalance,
    portfolio: {
      AAPL: 5,
      AMZN: 10,
    },
  };

  // 1. 使用上下文取得股票資訊
  const { stocks } = useContext(StockContext) || { stocks: [] };

  // 2. 初始化 Reducer 管理帳戶狀態
  const [account, dispatch] = useReducer(portfolioReducer, initialAccount);

  // 3. 計算投資組合的總價值
  const totalValue = useMemo(() => {
    return Object.entries(account.portfolio).reduce((total, [s, amount]) => {
      const stock = stocks.find(({ symbol }) => symbol === s);
      return stock ? total + stock.price * amount : total;
    }, 0);
  }, [stocks, account]);

  return (
    <>
      <h1>股票交易系統</h1>
      <div>
        <h2>股票列表</h2>
        <ul>
          {stocks.map((stock) => (
            <li key={stock.symbol}>
              <span>
                {stock.symbol}: ${stock.price.toFixed(2)}
              </span>
              <button
                onClick={() =>
                  dispatch({
                    type: "BUY",
                    payload: {
                      symbol: stock.symbol,
                      amount: 1,
                      price: stock.price,
                    },
                  })
                }
              >
                Buy 1
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "SELL",
                    payload: {
                      symbol: stock.symbol,
                      amount: 1,
                      price: stock.price,
                    },
                  })
                }
              >
                Sell 1
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>帳戶資訊</h2>
        <Account {...account} />
      </div>
      <div>投資組合價值</div>
      <p>{totalValue.toFixed(2)} USD</p>
    </>
  );
}

// 匯出的整合組件
function StockTradingApp() {
  return (
    <StockProvider>
      <StockTrading />
    </StockProvider>
  );
}

// 投資組合帳戶資訊
function Account({ balance }: PortfolioState) {
  return (
    <>
      <h3>帳戶名稱</h3>
      <div>帳戶餘額</div>
      <span>${balance.toFixed(2)}</span>
    </>
  );
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
  const currentAmount = state.portfolio[symbol] || 0;
  // 取得帳戶餘額
  const balance = state.balance;

  switch (action.type) {
    case "BUY": {
      // 如果餘額足夠則更新投資組合與餘額，反之回傳原本狀態
      if (balance >= transaction) {
        return {
          ...state,
          balance: balance - transaction, // 扣除購買金額
          // 合併到該 symbol 部位的數量
          portfolio: {
            ...state.portfolio,
            [symbol]: currentAmount + amount, // 增加股票數量
          },
        };
      }
      alert(`餘額不足，無法購買 ${amount} 股 ${symbol}。`);
      return state;
    }
    case "SELL": {
      // 如果股數足夠則更新投資組合與餘額，反之回傳原本狀態
      if (currentAmount >= amount) {
        return {
          ...state,
          balance: balance + transaction, // 增加賣出金額
          // 合併到該 symbol 部位的數量
          portfolio: {
            ...state.portfolio,
            [symbol]: currentAmount - amount, // 減少持有的股票數量
          },
        };
      }
      alert(`您只有 ${currentAmount} 股 ${symbol}，無法賣出 ${amount} 股。`);
      return state;
    }
    default:
      return state;
  }
};

export default StockTradingApp;