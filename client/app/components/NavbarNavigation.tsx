import React from "react";

interface NavbarNavigationProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
  handleCreate: () => void;
  className?: string;
  linkClassName?: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  buttonClassName?: string;
}

const NavbarNavigation: React.FC<NavbarNavigationProps> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  handleCreate,
  className = '',
  linkClassName = 'hover:text-gray-300',
  dropdownClassName = '',
  dropdownItemClassName = 'block px-4 py-2 hover:bg-[#24243e]',
  buttonClassName = 'hover:text-gray-300 cursor-pointer',
}) => {
  return (
    <div className={`gap-4 relative flex items-center ${className}`}>
      <a href="#" className={linkClassName}>
        Explore
      </a>
      <div className="relative">
        <button
          className={`${buttonClassName} focus:outline-none`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Collections
        </button>
        <div
          className={`absolute top-full left-0 mt-2 w-40 bg-[#302b63] shadow-lg rounded-md z-50 transition-all duration-300 overflow-hidden transform origin-top ${isDropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"} ${dropdownClassName}`}
        >
          <a href="#" className={dropdownItemClassName}>
            Trending
          </a>
          <a href="#" className={dropdownItemClassName}>
            New
          </a>
          <a href="#" className={dropdownItemClassName}>
            Top Rated
          </a>
        </div>
      </div>
      <button className={buttonClassName} onClick={handleCreate}>
        Mint
      </button>
    </div>
  );
};

export default NavbarNavigation;
