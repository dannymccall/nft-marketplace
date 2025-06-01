"use client";

import { FiCheck, FiCopy, FiLogIn } from "react-icons/fi";
import {
  FaUserCircle,
  FaShoppingBasket,
  FaRegUserCircle,
} from "react-icons/fa";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useHandleCopy } from "@/app/hooks/useCopy";
import { useNFTCart } from "../context/CartContext";
import { CgMenuGridO } from "react-icons/cg";
import { useSidebar } from "../context/SidebarContext";
import { IoMdSearch } from "react-icons/io";
import { useProfile } from "../context/ProfileContext";
import Modal from "./Modal";
import SearchForms from "./SearchForm";
import Image from "next/image";
import { SearchFormProps } from "./SearchForm";
import { usePathname } from "next/navigation";
import { useWallet } from "../context/WallatContext";
interface WalletButtonsProps extends SearchFormProps {
  user: { address: string; _id: string } | null;
  onLoginClick: () => void;
  handleLogout: () => any;
}

export default function WalletButtons({
  user,
  onLoginClick,
  handleLogout,
  typedQuery,
  setTypedQuery,
  handleKeydown,
}: WalletButtonsProps) {
  const { copyToClipboard, setCopied, copied } = useHandleCopy();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { toggleCart, items } = useNFTCart();
  const { closeSidebar, openSidebar } = useSidebar();
  const { profilePicture } = useProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { account } = useWallet();
  //Prevent the modal to close on every import except the user hits enter
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setModalOpen(false);
      handleKeydown(e);
    }
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center gap-2 w-full relative">
      {/* Wallet Button */}
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => {}}
        className="modal-top my-20"
      >
        <SearchForms
          typedQuery={typedQuery}
          setTypedQuery={setTypedQuery}
          handleKeydown={onKeyDown}
        />
      </Modal>
      <button
        className="relative lg:hidden btn glass bg-[#2f2960] text-slate-50 hover:text-indigo-400 p-2 sm:p-3"
        onClick={() => setModalOpen((prev) => !prev)}
      >
        <IoMdSearch size={20} />
      </button>
      {user ? (
        <div className="items-center hidden md:flex">
          <p className="glass flex items-center gap-1 h-10 px-1  hover:text-indigo-400 bg-[#2f2960]  text-slate-50 rounded-l-md rounded-r-none ">
            {`${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
          </p>

          {/* Copy Button */}
          <button
            onClick={() => {
              copyToClipboard(user.address), setCopied(true);
            }}
            className="btn glass bg-[#2f2960]  text-slate-50 hover:text-green-400 p-2 rounded-r-md rounded-l-none"
            title={copied ? "Copied!" : "Copy address"}
          >
            {copied ? <FiCheck /> : <FiCopy />}
          </button>
        </div>
      ) : (
        <button
          className="relative btn glass bg-[#2f2960]  text-slate-50 hover:text-indigo-400 p-2 sm:p-3"
          onClick={onLoginClick}
        >
          <FiLogIn size={20} />
          <span className="hidden md:inline">Login</span>
        </button>
      )}

      {/* Profile Button */}

      {profilePicture ? (
        // <div className="">
        <Image
          src={profilePicture}
          popoverTarget="popover-1"
          alt="Profile-picture"
          width={300}
          height={300}
          className="h-10 w-10 rounded-lg cursor-pointer relative"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />
      ) : user ? (
        // </div>
        <button
          className="relative btn glass bg-[#2f2960]  text-slate-50 hover:text-indigo-400 p-2 sm:p-3"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <FaUserCircle size={22} />
        </button>
      ) : (
        <button
          className="relative btn glass bg-[#2f2960]  text-slate-50 hover:text-indigo-400 p-2 sm:p-3"
          popoverTarget="popover-1"
          disabled={!user}
        >
          <FaUserCircle size={22} />
        </button>
      )}

      <ul
        className={`absolute  top-full left-12 mt-2 w-40 bg-slate-200 shadow-lg rounded-md z-50 transition-all duration-300 overflow-hidden transform origin-top ${
          isDropdownOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <li className="">
          <Link
            href={`/user/${user?._id}`}
            className="flex gap-3 items-center text-base w-full p-2 font-bold text-slate-700 hover:bg-gray-400"
          >
            <FaRegUserCircle />
            Profile
          </Link>
        </li>
        <li>
          <button
            className="flex gap-3 items-center text-base w-full p-2 font-bold text-slate-700 hover:bg-gray-400"
            onClick={handleLogout}
          >
            <CiLogout className="font-bold" />
            Logout
          </button>
        </li>
      </ul>
      {/* Basket Button */}
      <button
        className="relative btn glass bg-[#2f2960]  text-slate-50 hover:text-indigo-400 p-2 sm:p-3"
        onClick={toggleCart}
      >
        <FaShoppingBasket size={22} className="sm:w-6 sm:h-6 w-5 h-5" />

        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-slate-50 text-[#302b63] rounded-full text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold">
          {items.length}
        </span>
      </button>

      <CgMenuGridO
        cursor={"pointer"}
        size={30}
        className="text-slate-50 block md:hidden"
        onClick={openSidebar}
      />
    </div>
  );
}
