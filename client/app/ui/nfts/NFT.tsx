import React from "react";
import { UserNFTProps } from "@/app/lib/types";
import Image from "next/image";
import Link from "next/link";
import { toCapitalized } from "@/app/lib/helperFunctions";
import { IoArrowForwardCircleSharp } from "react-icons/io5";

interface NFTProps {
  nft: UserNFTProps;
}
const NFT: React.FC<NFTProps> = ({ nft }) => {
  return (
    <tr className="hover:bg-[#302b63] transition-all ease-in-out duration-300">
      <td className="text-left">
        <Image
          src={nft.image}
          alt={nft.name}
          width={300}
          height={300}
          className="w-16 h-16 object-cover rounded border border-slate-400"
        />
      </td>
      <td className="text-left text-slate-300 text-sm lg:text-base">
        {nft.name}
      </td>
      <td className="text-left text-slate-300 text-sm lg:text-base">
        {toCapitalized(nft.collectionName)}
      </td>
      {/* <td className="text-left text-slate-300 text-sm lg:text-base">
        {nft.price}
      </td> */}
      <td className="text-left text-slate-300 text-sm lg:text-base">
        <Link href={`/nft/${nft._id}`} className="text-amber-600 link-btn flex items-center gap-1">
          View <IoArrowForwardCircleSharp className="icon-move-left"/>

        </Link>
      </td>
    </tr>
  );
};

export default NFT;
