import mongoose, { Schema, Document } from "mongoose";

export interface IWallet_Auth extends Document {
  wallet_address: string;
  nonce: string;
}

export const WalletAuthenticationSchema = new Schema<IWallet_Auth>(
  {
    wallet_address: {
      type: String,
      required: true,
    },
    nonce: {
      type: String,
      required: true,
    },
   
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.WalletAuthentication) delete mongoose.models.WalletAuthentication;

export const WalletAuthentication = mongoose.model<IWallet_Auth>("WalletAuthentication", WalletAuthenticationSchema);
