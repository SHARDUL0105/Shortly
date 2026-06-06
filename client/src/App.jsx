import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <a href="/" className="nav-brand">🔗 Shortly</a>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats/:code" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
