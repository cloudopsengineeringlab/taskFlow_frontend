import React, { createContext, useMemo, useState } from "react";
import { loginApi, logoutApi, updatePasswordApi, updateProfileApi } from "./api";

const STORAGE_KEY = "taskflow-session";

export const ROLES = {
  admin: { label: "Administrateur", permissions: ["dashboard", "tâches", "projects", "analytics", "inbox", "audit", "users", "settings"] },
  manager: { label: "Manager", permissions: ["dashboard", "tâches", "projects", "analytics", "inbox"] },
  member: { label: "Membre", permissions: ["dashboard", "tâches", "projects", "inbox"] },
};

export function can(user, permission) {
  return Boolean(user && ROLES[user.role]?.permissions.includes(permission));
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")?.user || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginApi({ email, password });
      const remoteUser = response?.data?.user;
      const token = response?.data?.access_token;
      if (!remoteUser || !token) throw new Error("Réponse d'authentification invalide.");
      setUser(remoteUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: remoteUser, token }));
      return remoteUser;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async data => {
    const response = await updateProfileApi(data);
    const updated = response?.data?.user;
    const token = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").token || `local-${updated.id}`;
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, token }));
    return updated;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, loading, login, logout, updateProfile, can: p => can(user, p) }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return React.useContext(AuthContext); }
