// src/components/Header/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header({ title }) {
  const { toggleSidebar, notifications, unreadCount, markAllRead } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn" onClick={toggleSidebar} title="Toggle sidebar">
          ☰
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Search..." />
        </div>

        {/* Notifications */}
        <div className="notif-wrapper">
          <button
            className="icon-btn notif-btn"
            onClick={() => setShowNotif((p) => !p)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                <button onClick={markAllRead} className="mark-read-btn">
                  Mark all read
                </button>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`notif-item ${n.read ? "read" : ""}`}>
                  <div className="notif-dot" />
                  <div>
                    <p className="notif-msg">{n.message}</p>
                    <p className="notif-time">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="header-avatar">SK</div>
        <button className="icon-btn" onClick={handleLogout} title="Log out">
          ⎋
        </button>
      </div>
    </header>
  );
}
