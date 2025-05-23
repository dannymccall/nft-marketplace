// context/NotificationContext.tsx

"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type ToastType = "success" | "error" | "info" | "warning";

type Notification = {
  id: string;
  message: string;
  type: ToastType;
};

type NotificationContextType = {
  toasts: Notification[];
  showToast: (message: string, type?: ToastType) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Notification[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 6000); // auto-dismiss after 3s
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, showToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
