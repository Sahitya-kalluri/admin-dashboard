// src/components/Sidebar/Sidebar.js
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "⊞" },
  { path: "/users", label: "Users", icon: "👥" },
  { path: "/orders", label: "Orders", icon: "📦" },
  { path: "/analytics", label: "Analytics", icon: "📊" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const { sidebarOpen } = useApp();
  const location = useLocation();

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">AD</div>
        {sidebarOpen && <span className="logo-text">AdminPro</span>}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {sidebarOpen && <p className="nav-section-label">MAIN MENU</p>}
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            title={!sidebarOpen ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {sidebarOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="sidebar-footer">
          <div className="user-avatar">SK</div>
          <div className="user-info">
            <p className="user-name">Sahitya Kalluri</p>
            <p className="user-role">Frontend Developer</p>
          </div>
        </div>
      )}
    </aside>
  );
}
