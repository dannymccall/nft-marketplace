import mongoose, { Schema, Document } from "mongoose";

export interface NFTDocument extends Document {
  tokenId: number;
  name: string;
  description: string;
  image: string; // IPFS hash or URL
  metadataUri: string; // e.g., ipfs://Qm... or https://gateway.pinata.cloud/ipfs/...
  // attributes: { trait_type: string; value: string | number }[];
  owner: mongoose.Types.ObjectId; // wallet address
  creator: mongoose.Types.ObjectId; // original creator address
  collectionName?: string;

  previousOwners?: mongoose.Types.ObjectId;
}

const NFTSchema: Schema = new Schema<NFTDocument>(
  {
    tokenId: { type: Number, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    metadataUri: { type: String, required: true },
    // attributes: [
    //   {
    //     trait_type: { type: String, required: true },
    //     value: { type: Schema.Types.Mixed, required: true },
    //   },
    // ],
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    collectionName: { type: String },
    previousOwners: [
      { type: Schema.Types.ObjectId, required: true, ref: "User" },
    ],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.NFT) {
  // If the model already exists, we don't want to redefine it
  mongoose.deleteModel("NFT");
}
const NFT = mongoose.model<NFTDocument>("NFT", NFTSchema);

export default NFT;
