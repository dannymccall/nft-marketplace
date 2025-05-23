import React from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

const useLogout = () => {
    const {showToast} = useNotification();
    const {logout} = useAuth();
  const handleLogout = async () => {
    const data = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!data.ok) {
      console.error("Logout failed:", data.statusText);
      return;
    }
    const response = await data.json();
    if (!response.success) {
      throw new Error("Logout failed");
    }

    logout();
    showToast("Logout Successfully", "success");
    window.location.href = "/";
  };
  return {handleLogout};
};

export default useLogout;
