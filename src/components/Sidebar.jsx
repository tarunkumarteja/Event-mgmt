import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);

  return (
    <div
      className={`${
        isSidebarOpen ? "w-60" : "w-20"
      } h-screen bg-gray-900 text-white p-5 fixed transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {isSidebarOpen && (
          <h1 className="text-xl font-bold">Event Manager</h1>
        )}

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-yellow-400 text-lg"
        >
          {isSidebarOpen ? "⬅️" : "➡️"}
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-4">

        <NavLink to="/" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Dashboard" : "🏠"}
        </NavLink>

        <NavLink to="/attendance" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Attendance" : "👥"}
        </NavLink>

        <NavLink to="/events" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Events" : "📅"}
        </NavLink>

        <NavLink to="/gifts" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Money" : "💰"}
        </NavLink>

        <NavLink to="/prizes" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Prizes" : "🎁"}
        </NavLink>

        <NavLink to="/food" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Food" : "🍛"}
        </NavLink>

        <NavLink to="/lists" className={({ isActive }) =>
          isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
        }>
          {isSidebarOpen ? "Lists" : "📋"}
        </NavLink>

      </div>
    </div>
  );
}

export default Sidebar; 