// src/components/KPICards/KPICards.js
import React from "react";
import "./KPICards.css";

export default function KPICards({ kpis, loading }) {
  if (loading) {
    return (
      <div className="kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="kpi-card skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, i) => (
        <div key={i} className="kpi-card">
          <div className="kpi-top">
            <div>
              <p className="kpi-label">{kpi.label}</p>
              <p className="kpi-value">{kpi.value}</p>
            </div>
            <div className="kpi-icon">{kpi.icon}</div>
          </div>
          <div className={`kpi-change ${kpi.trend}`}>
            <span>{kpi.trend === "up" ? "▲" : "▼"}</span>
            <span>{kpi.change} vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}
