// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from "react";
import client from "../api/client";

export function useUsers({ search = "", role = "All", status = "All", page = 1, perPage = 10 } = {}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.get("/api/users", {
        params: { search, role, status, page, per_page: perPage },
      });
      setUsers(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, role, status, page, perPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(
    async (userData) => {
      try {
        await client.post("/api/users", userData);
        await fetchUsers();
        return true;
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to add user");
        return false;
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(async (id) => {
    try {
      await client.delete(`/api/users/${id}`);
      setUsers((p) => p.filter((u) => u.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete user");
    }
  }, []);

  return { users, total, totalPages, loading, error, addUser, deleteUser, refetch: fetchUsers };
}
