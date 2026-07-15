// src/pages/DashboardPage.js
import React from "react";
import Header from "../components/Header/Header";
import KPICards from "../components/KPICards/KPICards";
import { useAnalytics } from "../hooks/useAnalytics";
import "./DashboardPage.css";

const STATUS_CLASS = {
  Completed: "badge badge-success",
  Pending: "badge badge-warning",
  Processing: "badge badge-info",
  Cancelled: "badge badge-danger",
};

export default function DashboardPage() {
  const { analytics, loading } = useAnalytics();

  return (
    <>
      <Header title="Dashboard" />
      <div className="page-body">
        <KPICards kpis={analytics?.kpis || []} loading={loading} />

        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="card orders-card">
            <div className="card-header">
              <h2>Recent Orders</h2>
              <span className="view-all">View all →</span>
            </div>
            <div className="card-body">
              {loading ? (
                <p className="loading-text">Loading orders…</p>
              ) : (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.recentOrders?.map((order) => (
                      <tr key={order.id}>
                        <td className="order-id">{order.id}</td>
                        <td>{order.customer}</td>
                        <td className="amount">{order.amount}</td>
                        <td>
                          <span className={STATUS_CLASS[order.status] || "badge badge-neutral"}>
                            {order.status}
                          </span>
                        </td>
                        <td className="date">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card quick-stats-card">
            <div className="card-header">
              <h2>Quick Stats</h2>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <div className="stat-bar-label">
                  <span>Admin Users</span>
                  <span>32%</span>
                </div>
                <div className="stat-bar"><div className="stat-fill" style={{ width: "32%", background: "var(--danger)" }} /></div>
              </div>
              <div className="stat-row">
                <div className="stat-bar-label">
                  <span>Editors</span>
                  <span>45%</span>
                </div>
                <div className="stat-bar"><div className="stat-fill" style={{ width: "45%", background: "var(--primary)" }} /></div>
              </div>
              <div className="stat-row">
                <div className="stat-bar-label">
                  <span>Viewers</span>
                  <span>23%</span>
                </div>
                <div className="stat-bar"><div className="stat-fill" style={{ width: "23%", background: "var(--success)" }} /></div>
              </div>
              <div className="stat-row">
                <div className="stat-bar-label">
                  <span>Active Users</span>
                  <span>78%</span>
                </div>
                <div className="stat-bar"><div className="stat-fill" style={{ width: "78%", background: "var(--accent)" }} /></div>
              </div>

              <div className="activity-feed">
                <h3>Recent Activity</h3>
                {[
                  { msg: "New user Arjun registered", time: "2 min ago" },
                  { msg: "Order ORD-004 completed", time: "15 min ago" },
                  { msg: "Firebase sync successful", time: "1 hr ago" },
                  { msg: "Admin role assigned to Meera", time: "3 hrs ago" },
                ].map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot" />
                    <div>
                      <p className="activity-msg">{a.msg}</p>
                      <p className="activity-time">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
