import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Film,
  PlusCircle,
  Edit3,
  Users,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Menu,
  X
} from "lucide-react";
import "./sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { name: "Add Movie", icon: <PlusCircle size={18} />, path: "/add" },
    { name: "Edit Movies", icon: <Edit3 size={18} />, path: "/editmovies" },
    { name: "Manage Users", icon: <Users size={18} />, path: "/users" },
    { name: "Movie Stats", icon: <BarChart3 size={18} />, path: "/stats" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button className="admin-sidebar-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`admin-sidebar ${open ? "admin-open" : ""}`}>
        <h2 className="admin-sidebar-title">
          <Film /> Admin Panel
        </h2>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? "admin-active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="admin-logout-btn"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}
