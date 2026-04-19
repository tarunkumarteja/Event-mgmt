import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import logo from "../assets/logo.png";

// ICONS
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wallet,
  Gift,
  Utensils,
  List,
} from "lucide-react";

function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } =
    useContext(AppContext);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Attendance", path: "/attendance", icon: <Users size={20} /> },
    { name: "Events", path: "/events", icon: <CalendarDays size={20} /> },
    { name: "Money", path: "/gifts", icon: <Wallet size={20} /> },
    { name: "Prizes", path: "/prizes", icon: <Gift size={20} /> },
    { name: "Food", path: "/food", icon: <Utensils size={20} /> },
    { name: "Lists", path: "/lists", icon: <List size={20} /> },
  ];

  return (
    <div
      className={`fixed h-screen z-40 ${
        isSidebarOpen ? "w-60" : "w-20"
      } bg-[#0f0f0f] border-r border-gray-800 text-gray-200 p-4 transition-all duration-300`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center mb-8 ${
          isSidebarOpen ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-8 h-8" />

          {isSidebarOpen && (
            <h1 className="text-lg font-semibold">
              Event Manager
            </h1>
          )}
        </div>

        {isSidebarOpen ? (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ←
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute bottom-6 text-gray-400 hover:text-white"
          >
            →
          </button>
        )}
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-2">

        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            
            className={({ isActive }) =>
            `group relative flex items-center p-3 rounded-lg transition-all duration-200 hover:scale-[1.03] ${
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            } ${
              isSidebarOpen
                ? "gap-3 justify-start"
                : "justify-center"
            }`
          }
          >
            {({ isActive }) =>
            isActive && (
  <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r"></span>
)
}
            {/* ICON */}
            <span className="flex items-center justify-center">
  {item.icon}</span>

            {/* TEXT */}
            {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}

            {/* TOOLTIP */}
            {!isSidebarOpen && (
              <span className="absolute left-16 z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}

      </div>
    </div>
  );
}

export default Sidebar;