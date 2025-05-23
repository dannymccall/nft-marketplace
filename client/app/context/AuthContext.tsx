"use client"

import React, { createContext, useState, useEffect, useContext } from "react";
import { UserAuthProps } from "../lib/types";


interface AuthContextType {
  user: UserAuthProps | null;
  login: (userData: UserAuthProps) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserAuthProps>) => void; // ✅ Add function to update user

}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthProps | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await localStorage.getItem("userData");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error retrieving session:", error);
      } finally {
        setLoading(false); // Stop loading once user is retrieved
      }
    })();
  }, []);

  const login = async (userData: UserAuthProps) => {
    await localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await localStorage.removeItem("userData");
    setUser(null);
  };

  const updateUser = (updatedUser: Partial<UserAuthProps>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("userData", JSON.stringify(newUser)); // ✅ Save to localStorage
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {!loading && children} {/* Ensure UI only renders after loading */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
