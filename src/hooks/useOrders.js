// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from "react";
import client from "../api/client";

export function useOrders({ search = "", status = "All", page = 1, perPage = 5 } = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.get("/api/orders", {
        params: { search, status, page, per_page: perPage },
      });
      setOrders(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, perPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, total, totalPages, loading, error, refetch: fetchOrders };
}
