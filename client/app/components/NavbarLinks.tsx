import Link from "next/link";
import React from "react";
import Icon from "@/public/apc.png";
import Image from "next/image";
interface Props {
  navbarLinks: any[];
  isActive: (linkHref: string) => boolean;
  toggleDropdown: (linkName: string) => void;
  openDropdown: string | null;
  className?: string;
  handleLogout: () => Promise<any>;
}
const NavbarLinks = ({
  navbarLinks,
  isActive,
  toggleDropdown,
  openDropdown,
  className,
  handleLogout,
}: Props) => {

  return (
    <main className="flex justify-between w-full items-center">
        <Link
          href="/"
          className="w-96 text-violet-500 font-mono font-semibold text-xl flex flex-row  items-center"
        >
        <Image src={Icon} alt="icon" width={35}/>
          PE CREDIT
        </Link>

      <ul
        className={`flex space-x-6 ${className} desktop:place-content-end laptop:place-content-end w-full`}
      >
        {navbarLinks.map((link) => (
          <li key={link.name} className="relative">
            {/* Links without Sublinks */}
            {!link.subLinks ? (
              <Link
                href={link.href}
                className={`flex text-gray-700 font-sans font-semibold items-center space-x-2 p-2 rounded-md hover:text-violet-600 ${
                  isActive(link.href) ? "bg-white shadow-md" : ""
                } phone:hidden desktop:flex laptop:flex`}
              >
                <link.icon />
                <span>{link.name}</span>
              </Link>
            ) : (
              <>
                {/* Links with Sublinks
                {logginIdentity ? (
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className="flex desktop:items-center laptop:items-center phone:hidden desktop:flex laptop:flex justify-start  font-sans font-semibold desktop:text-gray-700 laptop:text-gray-700  phone:text-slate-100 space-x-2 p-2 rounded-md hover:text-violet-600"
                  >
                    <link.icon />
                    <span>{link.name}</span>
                    {openDropdown === link.name ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </button>
                ) : (
                  <LoadingSpinner color="text-gray-500 phone:hidden desktop:block tablet:hidden laptop:block" />
                )} */}

                {/* Sublinks Dropdown */}
                {openDropdown === link.name && (
                  <ul className="absolute mt-2 bg-white rounded-md shadow-lg z-10 w-full mb-2 ">
                    {link.subLinks.map((subLink: any) => (
                      <li key={subLink.name}>
                        {subLink.name === "Logout" ? (
                          <button
                            className="block w-full text-left p-2 text-red-500 hover:bg-gray-100"
                            onClick={handleLogout} // Call logout function
                          >
                            <subLink.icon className="mr-2 inline" />
                            {subLink.name}
                          </button>
                        ) : (
                          <Link
                            href={subLink.href}
                            className={`flex items-center text-gray-700  space-x-2 p-2 hover:bg-gray-100  hover:text-violet-600 ${
                              isActive(subLink.href) ? "bg-white shadow-md" : ""
                            }`}
                          >
                            <subLink.icon className="mr-2 inline" />
                            {subLink.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default NavbarLinks;
