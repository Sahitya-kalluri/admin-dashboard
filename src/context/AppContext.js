// src/context/AppContext.js
import React, { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registered", time: "2 min ago", read: false },
    { id: 2, message: "Server load high", time: "10 min ago", read: false },
    { id: 3, message: "Deployment successful", time: "1 hr ago", read: true },
  ]);

  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);
  const toggleTheme = useCallback(
    () => setTheme((p) => (p === "light" ? "dark" : "light")),
    []
  );
  const markAllRead = useCallback(
    () => setNotifications((p) => p.map((n) => ({ ...n, read: true }))),
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        theme,
        toggleTheme,
        notifications,
        unreadCount,
        markAllRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
