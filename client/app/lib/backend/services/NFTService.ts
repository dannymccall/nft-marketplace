import { CrudService } from "../crudService";
import NFT from "../models/nft.model";
import { getContractInstance } from "../../web3";
import MyNFT from "@/app/contracts/MyNFT.json";
import MyNFTMarketplace from "@/app/contracts/MyNFTMarketplace.json";
import { NFTDocument } from "../models/nft.model";

// const crudService = new CrudService(NFT);
 class NFTService extends CrudService<any> {
  constructor() {
    super(NFT);
  }

   async saveNFTData(data: NFTDocument){
    try{
      const nft = await this.create(data);
      if(nft) return nft;
      else throw new Error("NFT not created");
    }catch(e: any){
      console.error("Error saving NFT data", e);
      throw new Error("Error saving NFT data: " + e.message);
    }
  }

   async getAllNFTs(query: Record<string, any>){
    return this.findAll(query);
  }
   async getNFT(query: Record<string, any>){
    return this.findOne(query);
  }

  async updateModel(relation: Record<string, any>, newFields: Record<string, any>): Promise<any>{
    return this.updateOne(relation, newFields)
  }

  
}

const nftService = new NFTService();

export {nftService}