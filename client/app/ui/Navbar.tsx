"use client";

import { FaUserCircle, FaShoppingBasket } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import LoginController from "@/app/components/LoginController";
import { usePathname } from "next/navigation";
import Logo from "@/public/mint_logo.png";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import WalletButtons from "@/app/components/WalletButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useSearch } from "../context/SearchContext";
import NavbarNavigation from "@/app/components/NavbarNavigation";
import { useNotification } from "../context/NotificationContext";
import useLogout from "../hooks/useLogout";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { closeSidebar, isOpen } = useSidebar();
  const { typedQuery, setTypedQuery, setSearchQuery } = useSearch();
  const {handleLogout} = useLogout()

  const signout = () => {
    handleLogout()
  }
  const handleClickCreate = () => {
    if (!user) {
      setModalOpen(true);
      return;
    } else {
      router.push("/nft/mint-nft");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      closeSidebar();
      setSearchQuery(typedQuery);
    }
  }

  const pageClassName = `absolute top-full left-0 mt-2 w-40 bg-[#302b63] shadow-lg rounded-md z-50 transition-all duration-300 overflow-hidden transform origin-top ${
    isDropdownOpen
      ? "scale-y-100 opacity-100"
      : "scale-y-0 opacity-0 pointer-events-none"
  }`;

  return (
    <nav
      className={`w-full bg-[#0f0c29] text-white px-4 py-3 shadow-md fixed z-30 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent py-4"
      }`}
    >
      <LoginController modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <div className="max-w-7xl mx-auto flex items-center justify-between  gap-y-4">
        {/* Left Section: Logo and Nav Links */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="flex flex-row gap-3 items-center w-full">
            <Link href="/" className="flex flex-row gap-3">
              <Image
                src={Logo}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white  w-full hidden lg:block">
                DreamMint
              </span>
            </Link>
          </div>
          {/* <img src="/mint_logo.png" alt="Logo" className="w-10 h-10 rounded-full" /> */}

          <NavbarNavigation
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            handleCreate={handleClickCreate}
            className="hidden md:flex"
          />
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-grow max-w-md w-full hidden lg:block">
          <input
            type="text"
            placeholder="Search NFTs, Collections, Users..."
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={typedQuery}
            onChange={(e) => setTypedQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center gap-4">
          <WalletButtons
            user={user!}
            onLoginClick={() => setModalOpen(true)}
            handleLogout={signout}
            handleKeydown={handleKeyDown}
            typedQuery={typedQuery}
            setTypedQuery={setTypedQuery}
          />
        </div>
      </div>
    </nav>
  );
}
