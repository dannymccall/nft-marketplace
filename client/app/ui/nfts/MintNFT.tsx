// components/MintNFT.tsx
"use client";

import { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { createNFTSchema } from "@/app/lib/definitions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mint, listNFT } from "@/app/lib/helperFunctions";
import { checkIfUserExists } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
import { useWallet } from "@/app/context/WallatContext";
import { makeRequest } from "@/app/lib/helperFunctions";
import { stringifyBigInts } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import ApproveNFT from "@/app/components/ApproveNFT";
import ImageUpload from "@/app/components/ImageUploader";
import NFTMintForm from "@/app/components/NFTMintForm";
import ListNFTPriceModal from "@/app/components/ListNFTPriceModal";
import { useHandleSendToBackend } from "@/app/hooks/useSendToBackend";
export default function MintNFT() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>("");
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useNotification();
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [shouldListAfterApproval, setShouldListAfterApproval] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const { sendListingToBackend } = useHandleSendToBackend();
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
    getValues,
  } = useForm<CreateNFTSchema>({
    resolver: zodResolver(createNFTSchema),
    defaultValues: {
      name: "",
      description: "",
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
      console.log("Minting data:", data);
      setUploading(true);
      showToast("Minting NFT...", "info");
      await connectWallet();
      if (!web3 || !account) throw new Error("Wallet not connected");

      const userExists = await checkIfUserExists(account);
      if (!userExists)
        throw new Error("Please connect your wallet to mint an NFT");

      if (!file) {
        showToast("Please select a file!!!", "error");
        return;
      }

      const { metadataUri, metadataGatewayUrl } = await uploadToIPFS(data);
      const mintTx = await mint(metadataUri, account);
      if (!mintTx) throw new Error("Minting transaction failed");

      let listId: number | undefined;
      const tokenId = parseInt(
        mintTx.events?.Transfer.returnValues.tokenId!.toString()
      );
      setTokenId(tokenId);
      console.log("Token ID:", tokenId);
      const safeTx = stringifyBigInts(mintTx);

      const response = await saveNFTToBackend({
        receipt: safeTx,
        data: { ...data, metadataUri, metadataGatewayUrl, listId },
      });

      console.log(response);
      if (data.sell) {
        setShouldListAfterApproval(true); // Flag that we want to list after approval
      } else {
        reset();
        setPreview(null);
      }
      if (response.success) {
        showToast(response.message, "success");
        setPreview(null);
        return;
      } else {
        showToast(response.message, "error");
        reset();
        return;
      }
    } catch (error: any) {
      console.error("Mint error:", error.message);
      showToast(error.message, "error");
    } finally {
      setUploading(false);
      setMinting(false);
    }
  };

  const handleApprove = async (tokenId: number) => {
    if (!tokenId || !shouldListAfterApproval) return;

    console.log({ tokenId, price: price });
    setShouldListAfterApproval(false);
    const timeOut: NodeJS.Timeout = setTimeout(() => {
      setModalOpen(true);
    }, 2000);

    return () => clearTimeout(timeOut);
  };

  const handleOnSet = async (tokenId: number) => {
    try {
      const listReceipt = await listNFT(tokenId, price.toString());
      const listId = parseInt(
        listReceipt.events?.NFTListed.returnValues.id!.toString()
      );

       await sendListingToBackend({
        tokenId: tokenId,
        service: "listNFT",
        listId:listId,
        price: price,
      }, "/api/listing?service=listNFT");
    } catch (err: any) {
      console.error("List error:", err.message);
      showToast(err.message, "error");
    } finally {
      setShouldListAfterApproval(false); // Clean up
    }
  };
  const uploadToIPFS = async (data: CreateNFTSchema) => {
    const formData = new FormData();
    if (!user?.address) throw new Error("User address not available");
    formData.append("file", file as Blob);
    formData.append("metadata", JSON.stringify(data));
    formData.append("address", user.address!);

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
      <ApproveNFT
        modalOpen={shouldListAfterApproval}
        setModalOpen={(open) => {
          if (!open) setTokenId(null);
        }}
        tokenId={tokenId!}
        onClose={() => setTokenId(null)}
        onApprove={handleApprove}
      />
      <ListNFTPriceModal
        price={price}
        setPrice={setPrice}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => setPrice(0)}
        tokenId={tokenId!}
        onSet={() => handleOnSet(tokenId!)}
      />
      <div className="flex w-full py-36 flex-col justify-center items-center h-full p-4">
        <p className="text-slate-50 mb-4 text-center text-lg lg:text-xl font-semibold">
          Upload your image and fill in the details to mint your NFT.
        </p>
        <div className="w-full  flex flex-col items-center justify-center">
          <form
            className="flex flex-col md:flex-row gap-1 max-w-5xl w-full  p-6 rounded-xl shadow-lg"
            onSubmit={handleSubmit(handleMint)}
          >
            <ImageUpload
              file={file}
              preview={preview}
              error={error}
              handleUploadClick={handleUploadClick}
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
            />
            <NFTMintForm
              register={register}
              errors={errors}
              uploading={uploading}
              minting={minting}
            />
          </form>
        </div>
      </div>
    </main>
  );
}
