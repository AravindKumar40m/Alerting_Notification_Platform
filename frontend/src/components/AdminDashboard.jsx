import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    severity: "Info",
    visibility: { type: "Organization", target: [] },
    expiryTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });
  const navigate = useNavigate();
  const URL = "http://localhost:5000/api";

  useEffect(() => {
    axios
      .get(URL + "/alerts/")
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    try {
      axios
        .post(URL + "/alerts/", formData, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          setAlerts([...alerts, res.data]);
          setFormData({ ...formData, title: "", message: "" });
          console.log("Alert created successfully");
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading alerts...</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/analytics")}
        className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        View Analytics
      </button>
      <h2 className="text-2xl font-bold mb-4">Create Alert</h2>
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded shadow-md mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mb-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="w-full p-2 border rounded mb-2"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        <select
          className="w-full p-2 border rounded mb-2"
          value={formData.severity}
          onChange={(e) =>
            setFormData({ ...formData, severity: e.target.value })
          }
        >
          <option>Info</option>
          <option>Warning</option>
          <option>Critical</option>
        </select>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mb-2"
          value={formData.expiryTime}
          onChange={(e) =>
            setFormData({ ...formData, expiryTime: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Create
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Alerts List</h2>

      {alerts.length === 0 ? (
        <p>No alerts yet.</p>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div key={alert._id} className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">{alert.title}</h3>
              <p>{alert.message}</p>
              <span className="text-sm text-gray-500">
                Visibility: {alert.visibility.type} - Snoozed by:{" "}
                {alert.snoozedBy}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
