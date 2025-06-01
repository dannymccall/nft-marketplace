"use client";
import Image from "next/image";

import React, { useEffect, useState } from "react";
import { NFTProps, ListingProps } from "@/app/lib/types";
import { useNFTCart } from "@/app/context/CartContext";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useHandleCopy } from "@/app/hooks/useCopy";
import { useWallet } from "@/app/context/WallatContext";
import { useHandleSendToBackend } from "@/app/hooks/useSendToBackend";
import {
  listNFT as listNFTFromContract,
  approveAllNFTsForMarketplace,
  approveSingleNFT,
  checkIsApprovedForAll,
  checkApproved,
  cancelNFTListing,
  activateNFTListing,
  getListing,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import NFTActionButtons from "@/app/components/NFTActionButtons";
import { stringifyBigInts } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import { useRouter } from "next/navigation";
import ApproveNFT from "@/app/components/ApproveNFT";
import ListNFTPriceModal from "@/app/components/ListNFTPriceModal";
import NFTDetails from "@/app/components/NFTDetails";
import Loader from "@/app/components/Loader";
import { isOwner } from "@/app/lib/helperFunctions";
import Web3 from "web3";
interface INFT {
  nft: NFTProps;
}

const NFTCard = ({ nft }: INFT) => {
  const { addItem } = useNFTCart();
  const { copyToClipboard, setCopied, copied } = useHandleCopy();
  const { account } = useWallet();
  const { showToast } = useNotification();
  const [shouldListAfterApproval, setShouldListAfterApproval] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [showListButton, setShowListButton] = useState<boolean>(false);

  const router = useRouter();
  const [listingOnContract, setListingOnContract] = useState<
    Record<string, any>
  >({});
  const { sendListingToBackend } = useHandleSendToBackend();


  const handleListNFT = async (nft: NFTProps) => {
    const tokenId = parseInt(nft.tokenId);
    console.log({nft})
    try {
      const needsApproval = await checkApproved(tokenId);
      const isApprovedForAll = await checkIsApprovedForAll();
      console.log(needsApproval, isApprovedForAll);
      if (!needsApproval && !isApprovedForAll) {
        setShouldListAfterApproval(true);
        return;
      }
      setModalOpen(true);
    } catch (error: any) {
      console.log(error.message);
      showToast(error.message, "error");
    }
  };

  const listNFT = async (tokenId: number, price: string): Promise<any> => {
    if (!account) throw new Error("Wallet not connected");
    if (!tokenId || !price) throw new Error("Invalid tokenId or price");

    try {
      const receipt = await listNFTFromContract(tokenId, `${price}`);
      const listId = receipt.events?.NFTListed.returnValues.id!.toString();

      const safeTransaction = stringifyBigInts(receipt);
      await sendListingToBackend(
        {
          receipt: safeTransaction,
          listId: parseInt(listId),
          service: "listNFT",
          tokenId,
          price: parseFloat(price),
        },
        `/api/listing?service=listNFT`
      );
      router.refresh();
    } catch (error: any) {
      console.log(error.message);
      showToast(error.message, "error");
      return;
    }
  };

  useEffect(() => {
    (async () => {
      const listing = await getListing(parseInt(nft.tokenId));
      console.log("Listing", {listing});
      const listed = listing[0];
      console.log(listed.id.toString(), listed.sold, listed.active)
     setListingOnContract(listed);
     console.log(isOwner(account!, listed.seller))
      setShowListButton(isOwner(account!, listed.seller) && !listed.sold && !listed.active);
    })();
  }, []);

  const isListingReady =
  !listingOnContract  &&
  typeof listingOnContract === "object" &&
  Object.keys(listingOnContract).length > 0;

  useEffect(() => {
    console.log(listingOnContract.active)
    console.log(listingOnContract);
  }, []);
  // const handleOnApproved = async (nft: NFTProps) => {
  //   const tokenId = parseInt(nft.tokenId);

  //   const [listing, exists] = await getListing(tokenId);
  //   if (exists) {
  //     handleActivateNFT(listing.listId);
  //   } else {
  //     listNFT(tokenId, price.toString());
  //   }
  // };

  const handleCancelNFT = async (tokenId: number): Promise<any> => {
    try {
      const listing = await getListing(tokenId);
      const receipt = await cancelNFTListing(listing[0].id.toString());
      const listId =
        receipt.events?.ListingCanceled.returnValues.id!.toString();
        listId
      const safeTransaction = stringifyBigInts(receipt);
      console.log({id: listing[0].id})
      await sendListingToBackend(
        {
          listId: parseInt(listing[0].id.toString()),
          service: "cancelListing",
        },
        `/api/listing?service=cancelListing`
      );
      router.refresh();
    } catch (error: any) {
      console.log(error.message);
      showToast(error.message, "error");
    }
  };

  const handleOnSetPrice = async (tokenId: number) => {
    console.log("Setting price for tokenId:", tokenId, "Price:", price);
    setPrice(0);
    const listing = await getListing(tokenId);
    const exists = listing[1];
    console.log(exists)
    console.log("Listing", listing[0].id.toString());
    if (exists && !listing[0].sold) {
      await handleActivateNFT(parseInt(listing[0].id.toString()));
      router.refresh();
    } else {
      await listNFT(tokenId, price.toString());
      router.refresh();
    }
  };


  const handleActivateNFT = async (listId: number) => {
    // const tokenId = parseInt(nft.tokenId);
    try {
      const receipt = await activateNFTListing(listId, price);
      // const listId =
      //   receipt.events?.ListingActivated.returnValues.id!.toString();
      const safeTransaction = stringifyBigInts(receipt);
      await sendListingToBackend(
        {
          listId: listId,
          price: price,
          service: "activateListing",
        },
        `/api/listing?service=activateListing`
      );
    } catch (error: any) {
      console.log(error.message);
      showToast(error.message, "error");
    }
  };
  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-x-auto mb-5 relative">
      {isListingReady ? (
        <div className="w-full h-full my-auto relative bottom-0">
          <Loader />

        </div>
      ) : (
        <React.Fragment>
          <ApproveNFT
            modalOpen={shouldListAfterApproval}
            setModalOpen={setShouldListAfterApproval}
            onClose={() => setShouldListAfterApproval(false)}
            tokenId={parseInt(nft.tokenId)}
            onApprove={(tokenId) => {
              setTimeout(() => {
                setModalOpen(true);
              }, 2000);
              setShouldListAfterApproval(false);
            }}
          />
          <ListNFTPriceModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onClose={() => setShouldListAfterApproval(false)}
            price={price}
            setPrice={setPrice}
            tokenId={parseInt(nft.tokenId)}
            onSet={(price) => {
              handleOnSetPrice(parseInt(nft.tokenId));
              setShouldListAfterApproval(false);
            }}
          />

          <NFTDetails
            nft={nft}
            listingOnContract={listingOnContract}
            toCapitalized={(text) => toCapitalized(text)}
            copyToClipboard={(text) => copyToClipboard(text)}
            showListButton={showListButton}
            showCancelButton = {listingOnContract.seller && isOwner(account!, listingOnContract.seller) && listingOnContract.active && !listingOnContract.sold}
            handleCancelNFT={handleCancelNFT}
            handleListNFT={handleListNFT}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default NFTCard;
