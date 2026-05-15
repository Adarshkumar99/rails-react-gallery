import { createContext, useContext, useState } from "react";

// Create Context
const AuthContext = createContext();
//  Provider component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState(localStorage.getItem("email"));

  const isLoggedIn = !!token;

  const login = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setToken(token);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout , token}}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Easy use karne ke liye custom hook
export function useAuth() {
  return useContext(AuthContext);
}