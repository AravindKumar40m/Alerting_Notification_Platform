import React, { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/axios";

const severityIcons = {
  Info: <BellIcon className="h-5 w-5 text-blue-500" />,
  Warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
  Critical: <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />,
};

const UserDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user/alerts")
      .then((res) => {
        setAlerts(res.data);
        console.log(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/user/alerts/${id}/read`);
      setAlerts(
        alerts.map((a) => (a._id === id ? { ...a, status: "read" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSnooze = async (id) => {
    try {
      await api.put(`/user/alerts/${id}/snooze`);
      setAlerts(
        alerts.map((a) => (a._id === id ? { ...a, status: "snoozed" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Your Alerts Dashboard
        </h2>
        <p className="text-lg text-gray-600">
          Stay informed with real-time notifications
        </p>
      </div>
      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No alerts yet!
          </h3>
          <p className="text-gray-500">You're all caught up. Great job!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-6 rounded-xl shadow-md transition-all duration-300 transform hover:shadow-lg hover:scale-105 ${
                alert.status === "unread"
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
                  : alert.status === "snoozed"
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {severityIcons[alert.severity]}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      alert.severity === "Critical"
                        ? "bg-red-100 text-red-800"
                        : alert.severity === "Warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    alert.status === "unread"
                      ? "bg-yellow-200 text-yellow-800"
                      : alert.status === "snoozed"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {alert.status.toUpperCase()}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {alert.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {alert.message}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkRead(alert._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 transform hover:scale-105"
                  disabled={alert.status === "read"}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Mark Read</span>
                </button>
                <button
                  onClick={() => handleSnooze(alert._id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 transform hover:scale-105"
                >
                  <ClockIcon className="h-4 w-4" />
                  <span>Snooze</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Deliveries: {alert.deliveryCount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
