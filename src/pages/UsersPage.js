// src/pages/UsersPage.js
import React, { useState } from "react";
import Header from "../components/Header/Header";
import DataTable from "../components/DataTable/DataTable";
import { useUsers } from "../hooks/useUsers";
import "./UsersPage.css";

const ROLES = ["Admin", "Editor", "Viewer"];
const STATUSES = ["Active", "Inactive"];

const EMPTY_FORM = { name: "", email: "", role: "Viewer", status: "Active" };

export default function UsersPage() {
  // Users page pulls the full set once and hands rich client-side
  // sorting/filtering/CSV export to AG-Grid. Orders page (see OrdersPage.js)
  // demonstrates the server-side search/filter/pagination pattern instead —
  // both are real, deliberately different approaches to the same problem.
  const { users, loading, error, addUser, deleteUser, refetch } = useUsers({ perPage: 100 });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    const ok = await addUser(form);
    setSaving(false);
    if (ok) {
      setShowModal(false);
      setForm(EMPTY_FORM);
      setErrors({});
    }
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <>
      <Header title="Users" />
      <div className="page-body">
        {error && <div className="mock-banner">⚠️ {error}</div>}

        <div className="page-toolbar">
          <div>
            <h2 className="section-title">User Management</h2>
            <p className="section-sub">{users.length} total users</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add User
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading users…</div>
        ) : (
          <DataTable rows={users} onDelete={deleteUser} title="All Users" />
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  placeholder="e.g. Priya Reddy"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="e.g. priya@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
