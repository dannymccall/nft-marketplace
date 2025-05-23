"use client";
import { useNFTCart } from "@/app/context/CartContext";
import { TbFlagCancel } from "react-icons/tb";
import NFTImage from "@/public/nft-background.jpg";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/mint_logo.png";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { IoMdSearch } from "react-icons/io";
import { AiFillCloseCircle } from "react-icons/ai";
import NavbarNavigation from "./NavbarNavigation";
import { useProfile } from "../context/ProfileContext";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useHandleCopy } from "../hooks/useCopy";
import { CiLogout } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import useLogout from "../hooks/useLogout";
export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { profilePicture } = useProfile();
  const { copyToClipboard, setCopied, copied } = useHandleCopy();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
const {handleLogout} = useLogout()
  const router = useRouter();
  const { user } = useAuth();

  function handleCreate(): void {
    if (!user) {
      setModalOpen(true);
      return;
    } else {
      router.push("/nft/mint-nft");
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      closeSidebar();
    }, 100); // delay for smoother UX

    return () => clearTimeout(timeout);
  }, [pathname]);

  const signout = () => {
    handleLogout()
  }
  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 w-full bg-[#302b63] text-slate-200 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="space-y-4 overflow-y-auto h-[calc(100%-80px)] mb-auto">
        <div className="w-full flex justify-between items-center px-3 py-3 border-b-1 border-b-[#4a448a]">
          <div className="w-full flex items-center gap-4">
            <Link href="/">
              <Image
                src={Logo}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            {/* <img src="/mint_logo.png" alt="Logo" className="w-10 h-10 rounded-full" /> */}
            <span className="text-xl font-bold text-white ">DreamMint</span>
          </div>
          <div className="w-full flex gap-3 items-center justify-end">
            {/* <button>
              <IoMdSearch size={25} />
            </button> */}
            <button onClick={closeSidebar} className="cursor-pointer">
              <IoChevronBack size={25} />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-5 px-5">
          <div className=" ">
            {profilePicture ? (
              // <div className="">
              <div className="flex flex-col gap-3 ">
                <div
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                >
                  <Image
                    src={profilePicture}
                    alt="Profile-picture"
                    width={300}
                    height={300}
                    className="h-10 w-10 rounded-lg"
                  />
                  <p className="flex items-center gap-3 text-white">
                    {`${user?.address.slice(0, 6)}...${user?.address.slice(
                      -4
                    )}`}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent dropdown toggle
                        copyToClipboard(user?.address as string);
                        setCopied(true);
                      }}
                      title={copied ? "Copied!" : "Copy address"}
                      className="text-slate-50 hover:text-green-400 p-2 rounded"
                    >
                      {copied ? <FiCheck /> : <FiCopy />}
                    </button>
                  </p>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isProfileDropdownOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        href={`/user/${user?._id}`}
                        className="flex gap-3 items-center text-base w-full p-2 font-bold text-slate-400 hover:bg-gray-400"
                      >
                        <FaRegUserCircle />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="flex gap-3 items-center text-base w-full p-2 font-bold text-slate-400 hover:bg-gray-400"
                        // onClick={handleLogout}
                      >
                        <CiLogout className="font-bold" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              // </div>
              <button
                className=" flex gap-3 hover:text-indigo-400  text-slate-50  disabled:text-slate-50"
                disabled={!user}
              >
                <FaUserCircle size={22} />
                <p>Guest</p>
              </button>
            )}
          </div>
          <div className="">
            <h1 className="font-semibold flex flex-row items-center gap-2 font-sans mb-2 text-slate-200 text-base">
              <AiOutlineProduct />
              Products
            </h1>
            <div className="ml-7">

            <NavbarNavigation
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleCreate={handleCreate}
              className="flex-col items-start space-y-2"
              linkClassName="text-sm text-blue-400"
              dropdownClassName="bg-black w-52"
              dropdownItemClassName="block px-6 py-3 hover:bg-gray-700 text-sm"
              buttonClassName="text-sm text-blue-300"
            />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#453e92] p-4 w-full h-full text-center text-slate-100 text-lg">
        <button className="align-middle" onClick={signout}>Logout</button>
      </div>
    </div>
  );
}
