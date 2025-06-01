"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import {
  approveAllNFTsForMarketplace,
  approveSingleNFT,
} from "@/app/lib/helperFunctions"; // Assuming you separate your logic
import { useNotification } from "../context/NotificationContext";
interface ApproveNFTProps {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  tokenId: number;
  onClose: () => void;
  onApprove: (tokenId: number) => void; // Optional callback for parent component
}

const ApproveNFT: React.FC<ApproveNFTProps> = ({
  modalOpen,
  setModalOpen,
  onClose,
  tokenId,
  onApprove,
}) => {
  const [approvalType, setApprovalType] = useState<"single" | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useNotification();

  const handleApproval = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (approvalType === "all") {
        const receipt = await approveAllNFTsForMarketplace();
        if (receipt) {
          showToast("All NFTs approved for marketplace!", "success");
          onApprove(tokenId);
        }
      } else {
        const receipt = await approveSingleNFT(tokenId);
        if (receipt) {
          showToast(`NFT #${tokenId} approved for marketplace!`, "success");
          onApprove(tokenId);
        }
      }
    } catch (err: any) {
      showToast(err.message || "Approval failed.", "error");
    } finally {
      setLoading(false);
    }
  };
// dark:text-white
  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      onClose={onClose}
      title="Approve NFT for Marketplace"
    >
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 ">
          Choose Approval Type
        </label>
        <select
          className="w-full border rounded-md p-2 bg-white  text-gray-900 "
          value={approvalType}
          onChange={(e) => setApprovalType(e.target.value as "single" | "all")}
        >
          <option value="all">Approve All NFTs</option>
          <option value="single">Approve This NFT Only</option>
        </select>

        <button
          onClick={handleApproval}
          className="w-full bg-[#2F2960] rouded-md text-slate-100 py-1 px-5 cursor-pointer hover:bg-[#2C275C] transition-all duration-100"
          disabled={loading}
        >
          {loading ? "Processing..." : "Approve"}
        </button>

        {/* {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>} */}
      </div>
    </Modal>
  );
};

export default ApproveNFT;
