import { useState, useEffect } from "react";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    setData({
      events: JSON.parse(localStorage.getItem("events")) || [],
      attendance: JSON.parse(localStorage.getItem("attendance")) || [],
      money: JSON.parse(localStorage.getItem("money")) || 0,
      food: JSON.parse(localStorage.getItem("food")) || [],
      prizes: JSON.parse(localStorage.getItem("prizes")) || [],
    });
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div>Events: {data.events?.length}</div>
      <div>Attendance: {data.attendance?.length}</div>
      <div>Money: ₹{data.money}</div>
      <div>Food Items: {data.food?.length}</div>
      <div>Prizes: {data.prizes?.length}</div>
    </div>
  );
}

export default Dashboard;