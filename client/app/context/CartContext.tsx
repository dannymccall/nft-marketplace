"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type NFTItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  edition?: string;
  tokenId: number;
  listId: number;
};

type NFTCartContextType = {
  items: NFTItem[];
  addItem: (item: NFTItem) => void;
  removeItem: (id: string) => void;
  isOpen: boolean;
  toggleCart: () => void;
};

const NFTCartContext = createContext<NFTCartContextType | null>(null);

export const useNFTCart = () => {
  const context = useContext(NFTCartContext);
  if (!context) throw new Error("useNFTCart must be used within NFTCartProvider");
  return context;
};

export function NFTCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NFTItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (item: NFTItem) => {
    setItems((prev) => [...prev.filter((nft) => nft.id !== item.id), item]); // One per NFT
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <NFTCartContext.Provider
      value={{ items, addItem, removeItem, isOpen, toggleCart }}
    >
      {children}
    </NFTCartContext.Provider>
  );
}



