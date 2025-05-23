// components/MintNFT.tsx
"use client";

import { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { createNFTSchema } from "@/app/lib/definitions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mint, approve, listNFT } from "@/app/lib/helperFunctions";
import { checkIfUserExists } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
import { useWallet } from "@/app/context/WallatContext";
import { makeRequest } from "@/app/lib/helperFunctions";
import { stringifyBigInts } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
export default function MintNFT() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useNotification();
  // type ExtendedFormFields = CreateNFTSchema & {
  //   sell?: boolean; // or any name and type you want
  // };
  type CreateNFTSchema = z.infer<typeof createNFTSchema>;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNFTSchema>({
    resolver: zodResolver(createNFTSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      collection: "",
      sell: false,
    },
  });
  const { user } = useAuth();
  const { connectWallet, account, web3 } = useWallet();
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleMint = async (data: CreateNFTSchema) => {
    try {
      setUploading(true);

      await connectWallet();
      if (!web3 || !account) throw new Error("Wallet not connected");

      const userExists = await checkIfUserExists(account);
      if (!userExists)
        throw new Error("Please connect your wallet to mint an NFT");

      if (!file) throw new Error("Please upload a file");

      const { metadataUri, metadataGatewayUrl } = await uploadToIPFS(data);
      const mintTx = await mint(metadataUri, account);
      if (!mintTx) throw new Error("Minting transaction failed");

      let listId: number | undefined;
      const tokenId = parseInt(
        mintTx.events?.Transfer.returnValues.tokenId!.toString()
      );

      if (data.sell) {
        await approve(tokenId);
        const listReceipt = await listNFT(tokenId, data.price.toString());
        listId = parseInt(
          listReceipt.events?.NFTListed.returnValues.id!.toString()
        );
      }

      const safeTx = stringifyBigInts(mintTx);

      const response = await saveNFTToBackend({
        receipt: safeTx,
        data: { ...data, metadataUri, metadataGatewayUrl, listId },
      });
      if (response.success) {
        showToast(response.message, "success");
        reset();
      }
    } catch (error: any) {
      console.error("Mint error:", error.message);
      showToast(error.message, "error");
    } finally {
      setUploading(false);
      setMinting(false);
    }
  };

  const uploadToIPFS = async (data: CreateNFTSchema) => {
    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("metadata", JSON.stringify(data));
    formData.append("address", user?.address!);

    const res = await fetch("/api/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to upload to IPFS");
    }

    return result.metadata; // { metadataUri, metadataGatewayUrl }
  };

  const saveNFTToBackend = async (payload: { receipt: any; data: any }) => {
    const response = await makeRequest("/api/nft", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response || response.error) {
      throw new Error("Failed to save NFT to backend");
    }

    return response;
  };
  return (
    <main className="w-full overflow-hidden">
      <div className="flex w-full py-36 flex-col justify-center items-center h-full p-4">
        <p className="text-slate-50 mb-4 text-center text-lg lg:text-xl font-semibold">
          Upload your image and fill in the details to mint your NFT.
        </p>
        <div className="w-full  flex flex-col items-center justify-center">
          <form
            className="flex flex-col md:flex-row gap-1 max-w-5xl w-full  p-6 rounded-xl shadow-lg"
            onSubmit={handleSubmit(handleMint)}
          >
            <div className="md:w-1/2 w-full mb-4">
              {/* <label className="block  font-medium">Upload Image</label> */}
              <div className="flex flex-col lg:items-center justify-center w-96 h-full border-gray-300 rounded-lg mb-4 ">
                <label
                  className="flex flex-col items-center justify-center w-64 lg:w-full h-96 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-[#302b63]"
                  onClick={handleUploadClick}
                >
                  {file ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-96  rounded-lg"
                    />
                  ) : (
                    <FaUpload className="text-gray-400 text-4xl" />
                  )}
                </label>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <p className="text-gray-500 text-sm mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full hidden"
                ref={fileInputRef}
              />
            </div>
            <div className="md:w-1/2 w-full flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-slate-200 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="input input-bordered w-full text-gray-800 font-semibold"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-slate-200 font-medium">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  step="0.01"
                  min="0.01"
                  className="input input-bordered w-full text-gray-800 font-semibold"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-slate-200  font-medium">
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  className="textarea textarea-bordered w-full h-32 text-gray-800 font-semibold"
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-slate-200 font-medium">
                  Collection
                </label>
                <select
                  className="select select-bordered w-full text-gray-800 font-semibold cursor-pointer"
                  {...register("collection")}
                >
                  <option value="">Select collection</option>
                  <option value="music">Music</option>
                  <option value="art">Art</option>
                  <option value="game">Game</option>
                </select>
                {errors.collection && (
                  <p className="text-red-500 text-sm">
                    {errors.collection.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <label className="block mb-1 text-slate-200 font-medium">
                  Sell NFT
                </label>
                <input
                  type="checkbox"
                  className="checkbox checkbox-info"
                  {...register("sell")}
                />
              </div>
              <button
                className="btn w-full bg-[#302b63] hover:bg-[#4d488a] text-white"
                disabled={uploading || minting}
                type="submit"
              >
                {uploading
                  ? "Uploading..."
                  : minting
                  ? "Minting..."
                  : "Mint NFT"}
              </button>
              {/* {success && <p className="text-green-600 text-center">{success}</p>} */}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
