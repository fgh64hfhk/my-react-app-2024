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
      AAPL: { amount: 5, purchasePrice: 150 },
      AMZN: { amount: 10, purchasePrice: 3400 },
    },
    transactionHistory: [
      {
        symbol: "AAPL",
        amount: 5,
        price: 150,
        type: "BUY",
        timestamp: new Date("2025-01-01T10:00:00").toLocaleString(),
      },
      {
        symbol: "AMZN",
        amount: 10,
        price: 3400,
        type: "BUY",
        timestamp: new Date("2025-01-02T15:00:00").toLocaleString(),
      },
      {
        symbol: "AAPL",
        amount: 2,
        price: 155,
        type: "SELL",
        timestamp: new Date("2025-01-03T12:30:00").toLocaleString(),
      },
    ],
    errorMessage: "", // 初始化為空字串
  };

  // 1. 使用上下文取得股票資訊
  const { stocks } = useContext(StockContext) || { stocks: [] };

  // 2. 初始化 Reducer 管理帳戶狀態
  const [account, dispatch] = useReducer(portfolioReducer, initialAccount);

  // 3. 計算投資組合的總價值
  const totalValue = useMemo(() => {
    return Object.entries(account.portfolio).reduce(
      (total, [s, { amount }]) => {
        const stock = stocks.find(({ symbol }) => symbol === s);
        return stock ? total + stock.price * amount : total;
      },
      0
    );
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
        {/* 傳遞總價值作為參數 */}
        <Account portfolioValue={totalValue} {...account} />
      </div>
    </>
  );
}

// 投資組合帳戶資訊
function Account({
  balance,
  portfolio,
  transactionHistory,
  portfolioValue,
}: PortfolioState & { portfolioValue: number }) {
  return (
    <>
      <h3>帳戶名稱</h3>
      <div>
        帳戶餘額：<span>${balance.toFixed(2)}</span>
      </div>
      <div>
        投資組合總價值：<span>${portfolioValue.toFixed(2)} USD</span>
      </div>
      <h4>投資組合</h4>
      <table>
        <thead>
          <tr>
            <th>股票代碼</th>
            <th>數量</th>
            <th>購入價格</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(portfolio).map(
            ([symbol, { amount, purchasePrice }]) => {
              return (
                <tr key={symbol}>
                  <td>{symbol}</td>
                  <td>{amount}</td>
                  <td>{purchasePrice.toFixed(2)}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <h4>交易歷史</h4>
      <table>
        <thead>
          <tr>
            <th>股票代碼</th>
            <th>數量</th>
            <th>價格</th>
            <th>操作類型</th>
            <th>時間</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory.map((transaction, index) => {
            return (
              <tr key={index}>
                <td>{transaction.symbol}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.price.toFixed(2)}</td>
                <td>{transaction.type}</td>
                <td>{transaction.timestamp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// 定義投資組合狀態和動作
interface PortfolioState {
  balance: number; // 用戶當前餘額
  portfolio: {
    [symbol: string]: { amount: number; purchasePrice: number }; // 每個股票符號對應的持有數量和購入價格
  };
  transactionHistory: Transaction[]; // 交易歷史
  errorMessage: string; // 用於紀錄最近的錯誤訊息
}
// 定義交易歷史的狀態
interface Transaction {
  symbol: string;
  amount: number;
  price: number;
  type: "BUY" | "SELL";
  timestamp: string; // 交易時間
}
interface Action {
  type: "BUY" | "SELL"; // 動作類型:買入或賣出
  payload: {
    symbol: string; // 股票符號
    amount: number; // 賣出或買入的數量
    price?: number; // 股票價格，用於計算交易金額
  };
}
// 定義 Reducer -> 動作類型與資料載體
const portfolioReducer = (
  state: PortfolioState,
  action: Action
): PortfolioState => {
  // 取得動作裡面的資料載體 TODO 需要定義 payload
  const { symbol, amount, price = 0 } = action.payload;
  // 計算交易金額
  const transaction = amount * price;

  // 取得對應持有股票的數量
  const currentAmount = state.portfolio[symbol]?.amount || 0;
  // 取得對應持有股票的價格
  const currentPrice = state.portfolio[symbol]?.purchasePrice || 0;

  // 取得帳戶餘額
  const balance = state.balance;

  // 宣告一個交易明細
  const transactionDetails: Transaction = {
    symbol,
    amount,
    price,
    type: action.type,
    timestamp: new Date().toLocaleString(),
  };

  switch (action.type) {
    case "BUY": {
      // 如果餘額足夠則更新投資組合與餘額，反之回傳原本狀態
      if (balance >= transaction) {
        const newPortfolio = {
          ...state.portfolio,
          [symbol]: {
            amount: currentAmount + amount,
            purchasePrice:
              (currentAmount * currentPrice + transaction) /
              (currentAmount + amount), // 更新平均購入價格
          },
        };
        return {
          ...state,
          balance: balance - transaction, // 扣除購買金額
          // 更新投資組合
          portfolio: newPortfolio,
          transactionHistory: [...state.transactionHistory, transactionDetails],
          errorMessage: "",
        };
      }
      return {
        ...state,
        errorMessage: `你的餘額 ${balance} USD 不足以購買 ${symbol}:${price} USD ${amount} 股。`
      };
    }
    case "SELL": {
      // 如果股數足夠則更新投資組合與餘額，反之回傳原本狀態
      if (currentAmount >= amount) {
        const newPortfolio = {
          ...state.portfolio,
          [symbol]: {
            amount: currentAmount - amount,
            purchasePrice: currentPrice, // 保持原來的購買價格
          },
        };
        return {
          ...state,
          balance: balance + transaction, // 增加賣出金額
          // 更新投資組合
          portfolio: newPortfolio,
          transactionHistory: [...state.transactionHistory, transactionDetails],
          errorMessage: "",
        };
      }
      return {
        ...state,
        errorMessage: `您只有 ${currentAmount} 股 ${symbol}，無法賣出 ${amount} 股。`
      };
    }
    default:
      return state;
  }
};

// 樹根組件
function StockTradingApp() {
  return (
    <StockProvider>
      <StockTrading />
    </StockProvider>
  );
}

export default StockTradingApp;
