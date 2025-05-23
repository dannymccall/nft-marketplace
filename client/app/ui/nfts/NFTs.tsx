import React from "react";
import { UserNFTProps } from "@/app/lib/types";
import NFTList from "./NFTList";
import { h1 } from "framer-motion/client";
import { MdOutlineGridOn } from "react-icons/md";
import UserNFTs from "../users/UserNFTs";
import { FaListUl } from "react-icons/fa6";
import TabComponent from "@/app/components/Tabs";

interface NFTsProps {
  nfts: UserNFTProps[];
}

const NFTs: React.FC<NFTsProps> = ({ nfts }) => {

  const tabs = [
    {
      label: <MdOutlineGridOn size={25} cursor={'pointer'} className="mb-5"/>,
      content: <UserNFTs nfts={nfts} />,
    },
    {
      label: <FaListUl size={25} cursor={'pointer'} className="mb-5"/>,
      content: <NFTList nfts={nfts} />,
    },
  ];

  return (
    <div className="max-w-full">
     <TabComponent tabs={tabs} className="gap-3"/>
    </div>
  );
};

export default NFTs;
