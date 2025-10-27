import React, { createContext, useEffect, useState } from "react";
import API from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    return token && email ? { token, email } : null;
  });

  useEffect(() => {
    // optionally validate token on load by calling a protected endpoint
  }, []);

  const signup = async (name, email, password) => {
    const res = await API.post("/auth/signup", { name, email, password });
    return res.data;
  };

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { token, email: userEmail } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("email", userEmail);
    setUser({ token, email: userEmail });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
