import { useEffect } from "react";
import { useLocation, NavLink, Routes, Route } from "react-router-dom";
import "./NavigateRouter.css"; // 引入样式文件

function Home() {
  return <h2 className="page-title">Home Page</h2>;
}

function Profile() {
  return <h2 className="page-title">Profile Page</h2>;
}

function Settings() {
  return <h2 className="page-title">Settings Page</h2>;
}

// 置頂元件
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function NavigateRouter() {
  return (
    <div className="router-container">
      {/* 配置置頂元件 */}
      <ScrollToTop />
      {/* 左側導航列表 */}
      <nav className="navbar">
        {/* 导航链接，使用 NavLink 设置激活样式 */}
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Settings
            </NavLink>
          </li>
        </ul>
        {/* 股票儀表板 */}
      </nav>
      {/* 右側內容 */}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default NavigateRouter;
