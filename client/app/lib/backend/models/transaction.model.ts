import mongoose, {Document, Schema} from 'mongoose';

export interface TransactionReceipt extends Document {
  transactionHash: string;
  transactionType: string;
  transactionStatus: string;
  from: string;
  to: string;
  amount?: string; // Optional field for amount
  parent?: mongoose.Types.ObjectId; // Optional field for parent address
  child?: mongoose.Types.ObjectId; // Optional field for child address
}


export const TransactionReceiptSchema = new Schema<TransactionReceipt>(
  {
    transactionHash: { type: String, required: true },
    transactionType: { type: String, required: true },
    transactionStatus: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: String, required: false }, // Optional field for amount
    parent: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Optional field for parent address
    child: { type: Schema.Types.ObjectId, ref: 'Kid', required: false }, // Optional field for child address
  },
  { timestamps: true }
);



if (mongoose.models.TransactionReceipt) {
  // If the model already exists, we don't want to redefine it  
  mongoose.deleteModel('TransactionReceipt');
}
const TransactionReceiptModel = mongoose.model<TransactionReceipt>('TransactionReceipt', TransactionReceiptSchema);
export default TransactionReceiptModel;