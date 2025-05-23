import { CrudService } from "../crudService";
import TransactionReceiptModel, {
  TransactionReceipt,
} from "../models/transaction.model";
import mongoose from "mongoose";
class TransactionService extends CrudService<any> {
  // private crudService: CrudService<TransactionReceipt>;

  constructor() {
    super(TransactionReceiptModel);
    // this.crudService = new CrudService(TransactionReceiptModel);
  }

  static async createTransaction(
    data: {
      Transaction_ID: string;
      Status: string;
      From: string;
      To: string;
      // amount?: number;
    },
    transactionType: string,
    parentId: string,
    childId: string,
    cb: (data: any) => Promise<any>
  ) {
    if (!mongoose.Types.ObjectId.isValid(parentId) || !mongoose.Types.ObjectId.isValid(childId)) {
      throw new Error('Invalid parent or child ID');
    }
  
    const transactionService = new CrudService(TransactionReceiptModel);
    const { Transaction_ID, Status, From, To } = data;
  
    const newTransaction = {
      transactionHash: Transaction_ID,
      transactionType,
      transactionStatus: Status,
      from: From,
      to: To,
      parent: new mongoose.Types.ObjectId(parentId),
      child: new mongoose.Types.ObjectId(childId),
      // amount: data.amount,
    };
  
    console.log({ newTransaction });
  
    const newTransactionReceipt = await transactionService.create(newTransaction);
  
    if (newTransactionReceipt) {
      try {
        await cb(newTransactionReceipt);
      } catch (err) {
        console.error('Callback execution failed:', err);
      }
    }
  }
  
}


export {TransactionService}