// src/pages/SettingsPage.js
import React, { useState } from "react";
import Header from "../components/Header/Header";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Sahitya Kalluri",
    email: "kallurisahitya8717@gmail.com",
    role: "Frontend Developer",
    location: "Hyderabad, India",
  });
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    pushAlerts: false,
    weeklyReport: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (key) =>
    setNotifSettings((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <Header title="Settings" />
      <div className="page-body settings-body">
        {saved && (
          <div className="save-toast">✅ Settings saved successfully!</div>
        )}

        {/* Profile Settings */}
        <div className="card settings-card">
          <div className="card-header"><h2>Profile Settings</h2></div>
          <div className="card-body">
            <div className="settings-avatar-row">
              <div className="settings-avatar">SK</div>
              <div>
                <p className="settings-avatar-name">{profile.name}</p>
                <p className="settings-avatar-role">{profile.role}</p>
              </div>
            </div>
            <div className="settings-form">
              {[
                { label: "Full Name", key: "name" },
                { label: "Email", key: "email", type: "email" },
                { label: "Role", key: "role" },
                { label: "Location", key: "location" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key} className="form-group">
                  <label>{label}</label>
                  <input
                    type={type}
                    value={profile[key]}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card settings-card">
          <div className="card-header"><h2>Notifications</h2></div>
          <div className="card-body">
            {[
              { key: "emailAlerts", label: "Email Alerts", desc: "Get notified via email for important updates" },
              { key: "pushAlerts", label: "Push Notifications", desc: "Browser push notifications for real-time events" },
              { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly summary every Monday" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="notif-setting-row">
                <div>
                  <p className="notif-setting-label">{label}</p>
                  <p className="notif-setting-desc">{desc}</p>
                </div>
                <button
                  className={`toggle ${notifSettings[key] ? "on" : "off"}`}
                  onClick={() => toggleNotif(key)}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-outline">Reset to Defaults</button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
