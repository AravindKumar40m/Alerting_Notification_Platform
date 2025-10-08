import {
  BuildingOfficeIcon,
  EyeIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    severity: "Info",
    visibility: { type: "Organization", target: [] },
    expiryTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    startTime: new Date().toISOString().slice(0, 16),
  });
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  console.log(teams);
  console.log(users);

  useEffect(() => {
    Promise.all([api.get("/teams"), api.get("/users")]).then(
      ([teamsRes, usersRes]) => {
        setTeams(teamsRes.data);
        setUsers(usersRes.data);
      }
    );

    api
      .get("/alerts")
      .then((res) => {
        setAlerts(res?.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleVisibilityChange = (type) => {
    setFormData({ ...formData, visibility: { type, target: [] } });
  };

  const handleTargetChange = (e) => {
    const targets = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({
      ...formData,
      visibility: { ...formData.visibility, target: targets },
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/alerts", formData);
      setAlerts([...alerts, res.data]);
      setFormData({ ...formData, title: "", message: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Alert</span>
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Analytics
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Create New Alert</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                rows={4}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Info</option>
                <option>Warning</option>
                <option>Critical</option>
              </select>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                value={formData.expiryTime}
                onChange={(e) =>
                  setFormData({ ...formData, expiryTime: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <label className="block text-sm font-medium mb-2">
                  Visibility
                </label>
                <select
                  value={formData.visibility.type}
                  onChange={(e) => handleVisibilityChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Organization">
                    Entire Organization{" "}
                    <BuildingOfficeIcon className="h-4 w-4 inline ml-1" />
                  </option>
                  <option value="Team">
                    Specific Teams{" "}
                    <UserGroupIcon className="h-4 w-4 inline ml-1" />
                  </option>
                  <option value="User">
                    Specific Users <EyeIcon className="h-4 w-4 inline ml-1" />
                  </option>
                </select>
                {formData.visibility.type === "Team" && (
                  <select
                    multiple
                    value={formData.visibility.target}
                    onChange={handleTargetChange}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                  >
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                )}
                {formData.visibility.type === "User" && (
                  <select
                    multiple
                    value={formData.visibility.target}
                    onChange={handleTargetChange}
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {alert.title}
            </h3>
            <p className="text-gray-600 mb-3">{alert.message}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {alert.visibility.type}:{" "}
                {alert.visibility.target.join(", ") || "All"} | Snoozed:{" "}
                {alert.snoozedBy}
              </span>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
