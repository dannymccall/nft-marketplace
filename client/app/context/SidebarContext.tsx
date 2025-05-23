"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";


type NFTCartContextType = {
  isOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
};

const SidebarContext = createContext<NFTCartContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar must be used within SidebarContentProvider");
  return context;
};

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false)
  }


  const openSidebar = () => {
    setIsOpen(true)
  }
  useEffect(() => {
    setIsOpen(false)
  },[])


  return (
    <SidebarContext.Provider
      value={{ isOpen, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}



