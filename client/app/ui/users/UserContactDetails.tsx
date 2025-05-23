import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { UserproileProps } from "@/app/lib/types";

interface UserContactDetailsProps {
  handleOnClick: () => void;
  user: UserproileProps
}
const UserContactDetails: React.FC<UserContactDetailsProps> = ({
  handleOnClick,
  user
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-slate-100 font-semibold">Details</h1>
        <FaUserEdit
          className="cursor-pointer hover:text-gray-400 transition-all font-semibold duration-300 text-slate-100"
          onClick={handleOnClick}
        />
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-between lg:items-center">
        <h1 className="text-gray-400">Username</h1>
        <p className="border-1 border-gray-500 py-1 px-2 rounded-md text-gray-300 font-medium text-sm">{user.username}</p>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-between lg:items-center">
        <h1 className="text-gray-400">Email</h1>
        <p className="border-1 border-gray-500 py-1 px-2 rounded-md text-gray-300 font-medium text-sm">{user.email}</p>
      </div>
    </div>
  );
};

export default UserContactDetails;
