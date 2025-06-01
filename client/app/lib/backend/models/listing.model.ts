// models/Listing.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ListingDocument extends Document {
  nft: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  buyer?: mongoose.Types.ObjectId;
  price: number;
  active: boolean;
  listId: number;
  soldAt?: Date;
  listedBefore?: boolean;
  sold?: false;
}

const ListingSchema = new Schema<ListingDocument>(
  {
    nft: {
      type: Schema.Types.ObjectId,
      ref: "NFT",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    listId: {
      type: Number,
      required: true,
    },
    listedBefore: {
      type: Boolean,
      default:false
    },
    sold: {
      type: Boolean,
      default:false
    },
    soldAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);



if (mongoose.models.Listing) {
  // If the model already exists, we don't want to redefine it
  mongoose.deleteModel("Listing");
}
const Listing = mongoose.model<ListingDocument>("Listing", ListingSchema);

export default Listing;
