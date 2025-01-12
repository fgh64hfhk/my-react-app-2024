// 管理用户资产和交易操作
import { useContext, useEffect, useMemo, useReducer } from "react";
import { StockProvider, StockContext } from "./StockContext";

// 主組件的邏輯
function StockTrading() {
  // 初始化帳戶資金
  const initialBalance = 100;
  // 初始化帳戶資訊
  const initialAccount: PortfolioState = {
    balance: initialBalance,
    portfolio: {
      AAPL: { amount: 5, purchasePrice: 15 },
      AMZN: { amount: 10, purchasePrice: 35 },
    },
    transactionHistory: [
      {
        symbol: "AAPL",
        amount: 5,
        price: 15,
        type: "BUY",
        timestamp: new Date("2025-01-01T10:00:00").toLocaleString(),
      },
      {
        symbol: "AMZN",
        amount: 10,
        price: 35,
        type: "BUY",
        timestamp: new Date("2025-01-02T15:00:00").toLocaleString(),
      },
      {
        symbol: "AAPL",
        amount: 15,
        price: 15,
        type: "SELL",
        timestamp: new Date("2025-01-03T12:30:00").toLocaleString(),
      },
    ],
    profitLossRecords: [],
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

  // 4. 顯示錯誤訊息
  useEffect(() => {
    if (account.errorMessage) {
      alert(account.errorMessage);
    }
  }, [account.errorMessage]);

  return (
    <>
      <h1>股票交易系統</h1>
      <div>
        <h2>股票列表</h2>
        <ul>
          {stocks.map((stock) => (
            <li key={stock.symbol}>
              <div>
                股票代碼: {stock.symbol}, 股票價格: {stock.price},
                股票價格變動百分比:{" "}
                {Math.abs(stock.priceChange) > 3 ? (
                  <span style={{ color: "red" }}>{stock.priceChange}</span>
                ) : (
                  <span style={{ color: "blue" }}>{stock.priceChange}</span>
                )}
              </div>
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

// 投資組合帳戶資訊 --> 交集類型（Intersection Types）
function Account({
  balance,
  portfolio,
  transactionHistory,
  profitLossRecords,
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
      <h4>交易歷史紀錄</h4>
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
      <h4>損益平衡表</h4>
      <table>
        <thead>
          <tr>
            <th>股票代碼</th>
            <th>數量</th>
            <th>平均購入價格</th>
            <th>賣出價格</th>
            <th>總損益</th>
            <th>交易時間</th>
          </tr>
        </thead>
        <tbody>
          {profitLossRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.symbol}</td>
              <td>{record.amount}</td>
              <td>{record.averagePrice.toFixed(2)}</td>
              <td>{record.sellPrice.toFixed(2)}</td>
              <td>{record.profitLoss.toFixed(2)}</td>
              <td>{record.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// 定義投資組合狀態和動作
interface PortfolioState {
  balance: number; // 帳戶餘額
  portfolio: {
    [symbol: string]: {
      amount: number; // 股票持有數量
      purchasePrice: number; // 平均購入價格
    };
  };
  transactionHistory: Transaction[]; // 交易歷史記錄
  profitLossRecords: ProfitLoss[]; // 損益平衡記錄
  errorMessage: string; // 錯誤訊息
}
// 定義交易歷史明細規格
interface Transaction {
  symbol: string;
  amount: number;
  price: number;
  type: "BUY" | "SELL";
  timestamp: string; // 交易時間
}
// 定義損益平衡表規格
interface ProfitLoss {
  symbol: string; // 股票符號
  amount: number; // 賣出數量
  averagePrice: number; // 購入平均價格
  sellPrice: number; // 賣出價格
  profitLoss: number; // 總損益
  timestamp: string; // 時間戳
}
interface Action {
  type: "BUY" | "SELL"; // 動作類型:買入或賣出
  payload: Payload;
}
interface Payload {
  symbol: string; // 股票符號
  amount: number; // 賣出或買入的數量
  price?: number; // 股票價格，用於計算交易金額
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

  // 取得對應股票的數量與平均購入價格
  const currentAmount = state.portfolio[symbol]?.amount || 0;
  const currentPrice = state.portfolio[symbol]?.purchasePrice || 0;

  // 取得帳戶餘額
  const balance = state.balance;

  // 定義交易明細
  const transactionDetails: Transaction = {
    symbol,
    amount,
    price,
    type: action.type,
    timestamp: new Date().toLocaleString(),
  };

  switch (action.type) {
    case "BUY": {
      // 如果餘額不足，記錄錯誤訊息並返回
      if (balance < transaction) {
        return {
          ...state,
          errorMessage: `你的餘額 ${balance.toFixed(
            2
          )} USD 不足以購買 ${symbol}:${price} USD ${amount} 股。`,
        };
      }
      // 更新投資組合
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
    case "SELL": {
      // 如果股數不足，記錄錯誤訊息並返回
      if (currentAmount < amount) {
        return {
          ...state,
          errorMessage: `您只有 ${currentAmount} 股 ${symbol}，無法賣出 ${amount} 股。`,
        };
      }

      // 如果全數賣出，計算損益並記錄平衡表
      const isFullySold = currentAmount === amount;
      const profitLoss = isFullySold
        ? (price - currentPrice) * currentAmount
        : 0;

      // 創建新投資組合
      const newPortfolio = { ...state.portfolio };
      if (isFullySold) {
        delete newPortfolio[symbol]; // 股票全數賣出，從投資組合移除
      } else {
        newPortfolio[symbol] = {
          amount: currentAmount - amount,
          purchasePrice: currentPrice, // 保持原來的購買價格
        };
      }

      return {
        ...state,
        balance: balance + transaction, // 增加賣出金額
        portfolio: newPortfolio,
        transactionHistory: [...state.transactionHistory, transactionDetails],
        profitLossRecords: isFullySold
          ? [
              ...state.profitLossRecords,
              {
                symbol,
                amount: currentAmount,
                averagePrice: currentPrice,
                sellPrice: price,
                profitLoss,
                timestamp: transactionDetails.timestamp,
              },
            ]
          : state.profitLossRecords,
        errorMessage: "",
      };
    }
    default:
      return {
        ...state,
        errorMessage: `未知的動作類型: ${action.type}`,
      };
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
