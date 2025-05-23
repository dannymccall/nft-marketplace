"use client";
import React, { useEffect, useState } from "react";
import { styles } from "@/app/styles/styles";
import TabComponent from "@/app/components/Tabs";
import { useWallet } from "../context/WallatContext";
import { NFTProps } from "../lib/types";
import { makeRequest } from "../lib/helperFunctions";
import NFTListings from "../components/NFTListings";
import Loader from "../components/Loader";
import { useSearch } from "../context/SearchContext";
import NoNFTs from "../components/NoNFTs";
import { IoGameControllerSharp, IoMusicalNotes } from "react-icons/io5";
import { GiDart } from "react-icons/gi";

const Body = () => {
  const { account, connectWallet } = useWallet();
  const [nfts, setNfts] = useState<NFTProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { searchQuery, setSearchQuery } = useSearch();
  const [category, setCategory] = useState<string>("All");
  const fetchNFT = async (query: string = "") => {
    const response = await makeRequest(`/api/nft?filter=${query}`, {
      method: "GET",
    });
    console.log(response);
    setNfts(response.nfts);
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery !== "") {
      setLoading(true);
      fetchNFT(searchQuery);
    } else {
      fetchNFT(""); // default load
    }
  }, [searchQuery]);

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <React.Fragment>
        <div className="flex text-sm lg:text-base flex-wrap flex-row gap-4 w-full lg:w-1/2 mt-20 itens-center sm:justify-start justify-center text-slate-300">
          <button
            className={`py-1 px-4 border-1 border-[#6962b4] rounded-sm cursor-pointer hover:bg-[#17263a] hover:scale-105 transition-all duration-300 ${
              searchQuery === ""
                ? "bg-[#242425] text-slate-300 underline"
                : "bg-[#454170]"
            }`}
            onClick={() => {
              setSearchQuery("");
              setCategory("All");
            }}
          >
            All
          </button>

          <button
            className={`py-1 flex items-center gap-2 px-4 border-1 border-[#6962b4] rounded-sm cursor-pointer hover:bg-[#17263a] hover:scale-105 transition-all duration-300 ${
              searchQuery === "game"
                ? "bg-[#242425] text-slate-300 underline"
                : "bg-[#302b63]"
            }`}
            onClick={() => {
              setSearchQuery("game");
              setCategory("Games");
            }}
          >
            <IoGameControllerSharp />
            Games
          </button>
          <button
            className={`py-1 flex items-center gap-2 px-4 border-1 border-[#6962b4] rounded-sm cursor-pointer hover:bg-[#17263a] hover:scale-105 transition-all duration-300 ${
              searchQuery === "music"
                ? "bg-[#242425] text-slate-300 underline"
                : "bg-[#302b63]"
            }`}
            onClick={() => {
              setSearchQuery("music");
              setCategory("Music");
            }}
          >
            <IoMusicalNotes />
            Music
          </button>
          <button
            className={`py-1  flex items-center gap-2 px-4 border-1 border-[#6962b4] rounded-sm cursor-pointer hover:bg-[#17263a] hover:scale-105 transition-all duration-300 ${
              searchQuery === "art"
                ? "bg-[#242425] text-slate-300 underline"
                : "bg-[#302b63]"
            }`}
            onClick={() => {
              setSearchQuery("art");
              setCategory("Arts");
            }}
          >
            <GiDart />
            Arts
          </button>
        </div>
        <div
          className={`w-full bg-[#302b63] text-white px-4 py-3 h-full mt-5 rounded-sm shadow-md`}
        >
          <div className="bg-[url('/nft-background.jpg')] bg-cover bg-center h-64 rounded-lg flex items-center justify-center">
            <h1 className="lg:text-3xl md:text-2xl sm:text-xl font-bold text-white">
              Welcome to DreamMint
            </h1>
          </div>
        </div>
      </React.Fragment>
      {loading ? (
        <Loader />
      ) : nfts.length > 0 ? (
        <div>
          <h1 className="text-3xl font-bold my-6 text-slate-300">{category}</h1>
          <NFTListings nfts={nfts} />
        </div>
      ) : (
        <NoNFTs />
      )}
    </main>
  );
};

export default Body;
