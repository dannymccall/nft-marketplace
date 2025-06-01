"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { useNotification } from "../context/NotificationContext";


interface ApproveNFTProps {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  price: number;
  onClose: () => void;
  setPrice?: (price: number) => void; // Optional callback for parent component
  onSet: (price: number, tokenId: number) => void;
  tokenId?: number; // Optional tokenId if needed
}

const ListNFTPriceModal: React.FC<ApproveNFTProps> = ({
  modalOpen,
  setModalOpen,
  onClose,
  price,
  setPrice,
  onSet,
  tokenId
}) => {
  const [error, setError] = useState("");
  const {showToast} = useNotification();
  
  const handleSetPrice = async (tokenId: number) => {
    showToast("Setting Price!!!")
    if(!price || price <= 0) 
      return setError("Please enter a valid price.");
    showToast("Price set successfully", "success");
   setModalOpen(false);
   onSet(price, tokenId);
  };

  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      onClose={onClose}
      title="Approve NFT for Marketplace"
    >
      {/* dark:text-white */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 ">
          Enter Listing Price (in ETH):
        </label>
        <input
          type="number"
          placeholder="Enter Username"
          className="input input-bordered w-full text-gray-800 font-semibold"
          value={price}
          step="0.01"
          min="0.01"
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
              setPrice && setPrice(parseFloat(value));
            } else {
              setError("Please enter a valid price.");
            }
          }}
        />
        <button
          onClick={() => handleSetPrice(tokenId!)}
          className="w-full bg-[#2F2960] rouded-md text-slate-100 py-1 px-5 cursor-pointer hover:bg-[#2C275C] transition-all duration-100"
        >
          Set Price
        </button>

         {error && <p className="text-red-600 text-sm">{error}</p>}
        {/* {success && <p className="text-green-600 text-sm">{success}</p>}  */}
      </div>
    </Modal>
  );
};

export default ListNFTPriceModal;
