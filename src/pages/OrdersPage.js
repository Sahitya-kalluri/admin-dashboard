// src/pages/OrdersPage.js
import React, { useState } from "react";
import Header from "../components/Header/Header";
import { useOrders } from "../hooks/useOrders";
import "./OrdersPage.css";

const STATUS_CLASS = {
  Completed: "badge badge-success",
  Pending: "badge badge-warning",
  Processing: "badge badge-info",
  Cancelled: "badge badge-danger",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 5;

  // Filtering, searching, and pagination all happen server-side now —
  // this component just reflects whatever state the backend returns.
  const { orders, total, totalPages, loading } = useOrders({
    search,
    status: statusFilter,
    page,
    perPage,
  });

  return (
    <>
      <Header title="Orders" />
      <div className="page-body">
        <div className="page-toolbar">
          <div>
            <h2 className="section-title">Order Management</h2>
            <p className="section-sub">{total} orders found</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>All Orders</h2>
            <div className="table-controls">
              <input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                {["All", "Completed", "Pending", "Processing", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="empty-row">Loading…</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="6" className="empty-row">No orders found.</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id}>
                      <td className="order-id">{o.id}</td>
                      <td>{o.customer}</td>
                      <td className="product-name">{o.product}</td>
                      <td className="amount">₹{Number(o.amount).toLocaleString("en-IN")}</td>
                      <td><span className={STATUS_CLASS[o.status]}>{o.status}</span></td>
                      <td className="date">{o.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span className="page-info">
              Page {page} of {totalPages || 1}
            </span>
            <div className="page-btns">
              <button className="btn btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Prev
              </button>
              <button className="btn btn-outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
