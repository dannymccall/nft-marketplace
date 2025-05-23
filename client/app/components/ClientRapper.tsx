"use client";
import { AuthProvider } from "@/app/context/AuthContext";
import { WalletProvider } from "@/app/context/WallatContext";
import Navbar from "@/app/ui/Navbar";
import Footer from "@/app/ui/Footer";
import { NFTCartProvider } from "@/app/context/CartContext";
import NFTCartPanel from "./NFTCartPanel";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "../context/SidebarContext";
import WalletChecker from "./WalletChecker";
import { ProfileProvider } from "../context/ProfileContext";
import { NotificationProvider } from "../context/NotificationContext"; // 👈
import Toast from "../components/Toast"; // 👈 You must also render this!

import { SearchProvider } from "../context/SearchContext";
export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <WalletProvider>
        <SearchProvider>
          <WalletChecker>
            <AuthProvider>
              <ProfileProvider>
                <SidebarProvider>
                  <NFTCartProvider>
                    <NFTCartPanel />
                    <Sidebar />
                    <div className="px-4">
                      <Navbar />
                      {children}
                      <Footer />
                    </div>
                  </NFTCartProvider>
                </SidebarProvider>
              </ProfileProvider>
            </AuthProvider>
          </WalletChecker>
        </SearchProvider>
      </WalletProvider>
      <Toast />
    </NotificationProvider>
  );
}
