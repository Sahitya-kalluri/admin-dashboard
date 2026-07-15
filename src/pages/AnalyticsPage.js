// src/pages/AnalyticsPage.js
import React from "react";
import Header from "../components/Header/Header";
import KPICards from "../components/KPICards/KPICards";
import { useAnalytics } from "../hooks/useAnalytics";
import "./AnalyticsPage.css";

const MONTHLY = [
  { month: "Jul", value: 62 }, { month: "Aug", value: 74 }, { month: "Sep", value: 68 },
  { month: "Oct", value: 85 }, { month: "Nov", value: 79 }, { month: "Dec", value: 93 },
];

const maxVal = Math.max(...MONTHLY.map((m) => m.value));

const TRAFFIC = [
  { source: "Organic Search", visits: "4,820", pct: 38, color: "var(--primary)" },
  { source: "Direct", visits: "2,140", pct: 17, color: "var(--success)" },
  { source: "Social Media", visits: "1,960", pct: 15, color: "var(--accent)" },
  { source: "Referral", visits: "3,080", pct: 24, color: "var(--warning)" },
  { source: "Email", visits: "760", pct: 6, color: "var(--danger)" },
];

export default function AnalyticsPage() {
  const { analytics, loading } = useAnalytics();

  return (
    <>
      <Header title="Analytics" />
      <div className="page-body">
        <KPICards kpis={analytics?.kpis || []} loading={loading} />

        <div className="analytics-grid">
          {/* Bar Chart */}
          <div className="card">
            <div className="card-header"><h2>Monthly Revenue (₹K)</h2></div>
            <div className="card-body">
              <div className="bar-chart">
                {MONTHLY.map((m) => (
                  <div key={m.month} className="bar-col">
                    <div className="bar-label-top">₹{m.value}K</div>
                    <div
                      className="bar-fill"
                      style={{ height: `${(m.value / maxVal) * 180}px` }}
                    />
                    <div className="bar-label-bottom">{m.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="card">
            <div className="card-header"><h2>Traffic Sources</h2></div>
            <div className="card-body">
              {TRAFFIC.map((t) => (
                <div key={t.source} className="traffic-row">
                  <div className="traffic-meta">
                    <span className="traffic-dot" style={{ background: t.color }} />
                    <span className="traffic-source">{t.source}</span>
                    <span className="traffic-visits">{t.visits}</span>
                    <span className="traffic-pct">{t.pct}%</span>
                  </div>
                  <div className="traffic-bar">
                    <div
                      className="traffic-fill"
                      style={{ width: `${t.pct}%`, background: t.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
