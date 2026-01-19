import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔥 LOAD USER ON APP START
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("user_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_token", token);
    setUser(userData); // 🔥 THIS TRIGGERS RE-RENDER
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_token");
    setUser(null); // 🔥 INSTANT UPDATE
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
