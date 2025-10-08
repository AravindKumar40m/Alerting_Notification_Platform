import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
// import Analytics from "./components/Analytics";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import "./index.css";

const ProtectedRoute = ({ children, requiresAdmin = false }) => {
  const { user, token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  if (requiresAdmin && user?.role !== "Admin") return <Navigate to="/" />;
  return children;
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg p-4 text-white sticky top-0 z-50">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold flex items-center">
              <span className="mr-2">🔔</span> Alerting Platform
            </h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="hidden md:block">Hi, {user?.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiresAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/analytics"
            element={
              <ProtectedRoute requiresAdmin>
                <Analytics />
              </ProtectedRoute>
            }
          /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
