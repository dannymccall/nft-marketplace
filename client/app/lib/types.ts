export type Transaction = {
  transactionHash: string;
  transactionStatus: string;
  from: string;
  to: string;
  _id: string;
  createdAt: string;
};

export interface ITransaction {
  transaction: Transaction;
}

export interface TransactionProps {
  transactions: Transaction[];
}

export type Account = {
  childName: string;
  loginId: string;
  childAddress: string;
  _id: string;
  createdAt: string;
};

export interface SessionDetails {
  _id: string; // ObjectId as string
  address: string;
  email?: string;
  emailVerified?: boolean;
  username?: string;
  role?: string;
}

export interface UserAuthProps {
  username?: string;
  email?: string;
  isVerified: boolean;
  userId?: string;
  role?: string;
  address: string;
  _id: string
}
export interface IAccount {
  account: Account;
}
export interface AccountProps {
  accounts: Account[];
}

export interface CustomFile {
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  size: number;
  // Add other properties if needed, for example:
  // type: string;
}

export interface ParentData {
  _id: string;
  address: string;
  email: string;
  child?: {
    _id: string;
    address: string;
  };
}

export interface ChildData {
  _id: string;
  address: string;
  parent?: {
    _id: string;
    address: string;
    email: string;
  };
}

export interface GetUserDataOptions {
  userId?: string;
  childAddress: string;
  isParent: boolean;
}

export interface GetUserDataResult {
  parent?: ParentData;
  child?: ChildData;
  error?: string;
}

export type NFTProps = {
  _id: string;
  name: string;
  price: number;
  tokenId: string;
  active: boolean;
  listId: number;
  owner: {
    address: string;
  };
  creator: {
    address: string;
  };
  image: string;
  collectionName: string;
};

export type UserNFTProps = {
  _id: string;
    name: string;
    image: string;
    collectionName: string;
    price: number;
    listed: boolean;
    owner: {
      address: string
    }
}
export type UserproileProps = {
  _id: string;
  address: string;
  role: string;
  avarta: string;
  username: string;
  email: string;
  owner: {
    address: string
  }
  OwnedNFTs: UserNFTProps[]
};
