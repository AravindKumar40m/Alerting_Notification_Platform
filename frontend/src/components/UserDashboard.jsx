import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = "http://localhost:5000/api";
  console.log(alerts);

  useEffect(() => {
    axios
      .get(URL + "/user/alerts")
      .then((res) => {
        console.log(res);
        setAlerts(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Alerts</h2>
      <div className="grid gap-4">
        {alerts?.map((alert) => (
          <div></div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
