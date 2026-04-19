import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import "./index.css";

import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Events from "./pages/Events";
import Gifts from "./pages/Gifts";
import Prizes from "./pages/Prizes";
import Food from "./pages/Food";
import Lists from "./pages/Lists";

function App() {
  const { isSidebarOpen } = useContext(AppContext);

  return (
    <Router>
  <div
    className="min-h-screen bg-cover bg-center"
    
  >
    {/* overlay for readability */}
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />

        <div
          className={`${
            isSidebarOpen ? "ml-60" : "ml-20"
          } w-full bg-[#111111] text-gray-200 min-h-screen p-4 transition-all duration-300`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/prizes" element={<Prizes />} />
            <Route path="/food" element={<Food />} />
            <Route path="/lists" element={<Lists />} />
          </Routes>
        </div>
      </div>
    </div>
  </div>
</Router>
  );
}

export default App;