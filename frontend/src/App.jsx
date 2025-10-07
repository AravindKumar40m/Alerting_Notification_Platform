import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
// import Analytics from "./components/Analytics";
import "./index.css"; // Tailwind

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <h1 className="text-xl">Alerting Platform</h1>
        </nav>
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* <Route path="/analytics" element={<Analytics />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
