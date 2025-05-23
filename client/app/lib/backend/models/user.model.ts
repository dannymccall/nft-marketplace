import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  username?: string;
  emailVerified?: boolean;
  address?: string;
  role?: string;
  transactions?: mongoose.Types.ObjectId; // Define a more specific type if possible
  avarta?: string;
  createdAt: Date;
  updatedAt: Date;
  OwnedNFTs?: mongoose.Types.ObjectId; // Define a more specific type if possible
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: false},
    username: { type: String, required: false,},
    emailVerified: { type: Boolean, default: false },
    address: { type: String, required: true },
    role: { type: String, enum: ['parent', 'admin', 'user'], default: 'user' },

    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }], // refine if you know structure

    avarta: { type: String },
    OwnedNFTs: [{ type: Schema.Types.ObjectId, ref: 'NFT' }], // refine if you know structure
  },
  { timestamps: true }
);

if (mongoose.models.User) {
  // If the model already exists, we don't want to redefine it  
  mongoose.deleteModel('User');
}

// Prevent model overwrite on hot reloads (important in Next.js)
export const User = mongoose.model<IUser>('User', UserSchema);
