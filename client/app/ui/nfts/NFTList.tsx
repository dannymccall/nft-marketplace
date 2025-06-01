import { UserNFTProps } from "@/app/lib/types";
import React from "react";
import NFT from "./NFT";

interface NFTListProps {
  nfts: UserNFTProps[];
}
const NFTList: React.FC<NFTListProps> = ({ nfts }) => {
  return (
    <div className="w-full h-full relative shadow-md overflow-x-auto">
      {nfts.length > 0 ? (
        <table className="table  table-xs able-zebra w-full">
          {/* head */}
          <thead className="relative">
            <tr className="relative text-slate-100">
              <th className="text-base font-sans font-medium text-slate-100 text-left p-2">
                NFT
              </th>
              <th className="text-base font-sans font-medium text-slate-100 p-2">
                Name
              </th>
              <th className="text-base font-sans font-medium text-slate-100 p-2">
                Collection
              </th>
              {/* <th className="text-base font-sans font-medium text-slate-100 p-2">
                Price
              </th> */}
              <th className="text-base font-sans font-medium text-slate-100 p-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {nfts.map((nft: UserNFTProps | any) => (
              <NFT key={nft._id} nft={nft} />
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="px-5 py-2 text-slate-200">No Records Found</h1>
      )}
    </div>
  );
};

export default NFTList;
