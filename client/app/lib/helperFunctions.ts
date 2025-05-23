import { UserAuthProps } from "./types";
import NFTCONTRACT from "@/app/contracts/MyNFT.json";
import NFTMARKETCONTRACT from "@/app/contracts/MyNFTMarketplace.json";
import { NFTProps } from "./types";
import { getContractInstance } from "@/app/lib/web3";
import { Web3 } from "web3";

async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No wallet connected, Please install metamask to continue.");
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const account = accounts[0];
  const web3 = new Web3(window.ethereum);

  return { web3, account };
}

export async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    // console.log(data)
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Network response was not ok");
    }

    return data;
  } catch (error: any) {
    console.error("Request failed:", error.message);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server. Please try again later.",
      },
    };
  }
}

type EstimateOptions = {
  method: string;
  args?: any[];
  from: string;
  valueInEth?: string; // optional ETH value to send
};

export async function calculateGasEstimate({
  method,
  args = [],
  from,
  valueInEth,
}: EstimateOptions): Promise<number> {
  const { web3, contract } = getContractInstance(
    process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS || "",
    NFTCONTRACT.abi
  );

  const options: Record<string, any> = { from };

  if (valueInEth) {
    options.value = web3.utils.toWei(valueInEth, "ether");
  }

  try {
    const gasEstimate = await contract.methods[method](...args).estimateGas(
      options
    );
    return gasEstimate as any;
  } catch (error) {
    console.error("Failed to estimate gas:", error);
    throw error;
  }
}

export async function mint(tokenUri: string, from: string) {
  const { web3, account } = await connectWallet();
  const contract = new web3.eth.Contract(
    NFTCONTRACT.abi,
    process.env.NEXT_PUBLIC_NFT_ADDRESS
  );

  try {
    const valueInWei = web3.utils.toWei("0.01", "ether");

    // const gasEstimate = await contract.methods
    //   .mintNFT(tokenUri)
    //   .estimateGas({ from: account });

    const txReceipt = await contract.methods.mintNFT(tokenUri).send({
      from: account,
      // gas: gasEstimate as any,
      // value: valueInWei,
    });

    return txReceipt;
  } catch (error: any) {
    console.error("Error minting NFT:", error.message || error);
    throw new Error("Failed to mint NFT");
  }
}

export async function approve(tokenId: number) {
  const { web3, account } = await connectWallet();
  const contract = new web3.eth.Contract(
    NFTCONTRACT.abi,
    process.env.NEXT_PUBLIC_NFT_ADDRESS
  );

  try {
    // const gasEstimate = await calculateGasEstimate({
    //   method: "approve",
    //   args: [process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS, tokenId],
    //   from,
    // });

    const txReceipt = await contract.methods
      .approve(process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS, tokenId)
      .send({
        from: account,
        // gas: gasEstimate as any,
      });

    return txReceipt;
  } catch (error: any) {
    console.error("Error approving NFT:", error.message || error);
    throw new Error("Failed to approve NFT");
  }
}

export async function checkApproved(tokenId: number) {
  const { web3, account } = await connectWallet();

  const contract = new web3.eth.Contract(
    NFTCONTRACT.abi,
    process.env.NEXT_PUBLIC_NFT_ADDRESS
  );

  const approvedAddress = await contract.methods.getApproved(tokenId).call();
  console.log({ approvedAddress });
  return (
    (approvedAddress as any).toLowerCase() ===
    process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS!.toLowerCase()
  );
}

export async function listNFT(tokenId: number, price: string) {
  const { web3, account } = await connectWallet();
  const contract = new web3.eth.Contract(
    NFTMARKETCONTRACT.abi,
    process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS
  );

  try {
    const valueInWei = web3.utils.toWei(price, "ether");

    // const gasEstimate = await calculateGasEstimate({
    //   method: "listNFT",
    //   args: [nftContract, tokenId, valueInWei],
    //   from,
    // });

    const txReceipt = await contract.methods
      .listNFT(process.env.NEXT_PUBLIC_NFT_ADDRESS, tokenId, valueInWei)
      .send({
        from: account,
        // gas: gasEstimate as any,
      });
    return txReceipt;
  } catch (error: any) {
    console.error("Error listing NFT:", error.message || error);
    throw new Error("Failed to list NFT");
  }
}

export async function buyNFT(tokenId: number, price: number, listId: number) {
  const { web3, account } = await connectWallet();

  const contract = new web3.eth.Contract(
    NFTMARKETCONTRACT.abi,
    process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS
  );

  console.log("buyNFT called with:", { tokenId, price, listId, account });
  console.log("market address: ", process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS);
  if (!price || isNaN(price) || price <= 0) {
    throw new Error("Invalid price value provided.");
  }

  if (typeof tokenId !== "number" || typeof listId !== "number") {
    throw new Error("Invalid token or listing ID");
  }

  try {
    const valueInWei = web3.utils.toWei(price.toString(), "ether");
    console.log("Sending value (wei):", valueInWei);

    const listing = await contract.methods.returnListing(listId).call();
    console.log("Listing state:", listing);

    const gasEstimate = await contract.methods
      .buyNFT(tokenId, listId)
      .estimateGas({ from: account, value: valueInWei });
    console.log({ gasEstimate });
    if (!gasEstimate) throw new Error("Error in calculating gas");
    const txReceipt = await contract.methods
      .buyNFT(tokenId, listId)
      .send({ from: account, value: valueInWei });

    return txReceipt;
  } catch (error: any) {
    console.error("Error buying NFT:", error.message || error);
    throw new Error(error.message || "Failed to buy NFT");
  }
}

export async function cancelListing(tokenId: number) {
  const { web3, account } = await connectWallet();
  const contract = new web3.eth.Contract(
    NFTMARKETCONTRACT.abi,
    process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS
  );
}

export async function checkIfUserExists(address: string) {
  try {
    const user = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/check?address=${address}`
    );

    if (!user.ok) {
      throw new Error("User not found");
    }

    const userData = await user.json();
    return userData;
  } catch (error: any) {
    console.error("Error checking user existence:", error.message || error);
    throw new Error("Failed to check user existence");
  }
}

export function formatTransaction(transaction: any) {
  const {
    transactionHash,
    blockNumber,
    status,
    from,
    to,
    gasUsed,
    effectiveGasPrice,
    logs,
  } = transaction;

  // Convert gas price from Wei to Gwei and compute total fee
  const gasPriceGwei = Number(effectiveGasPrice) / 1e9;
  const totalFeeEth = (Number(gasUsed) * gasPriceGwei) / 1e9;

  // Generalized log parser
  const parsedLogs =
    logs?.map((log: any, index: number) => {
      const eventSignature = log.topics?.[0] || "N/A";
      const eventData = log.data || "No data";

      // Try to extract tokenId or numeric value from the data (first 32 bytes)
      let parsedValue = "N/A";
      try {
        parsedValue = parseInt(log.data?.slice(0, 66), 16).toString();
      } catch (_) {
        // fall back
      }

      return {
        Log_Index: index,
        Event_Signature: eventSignature,
        Parsed_Value: parsedValue,
        Raw_Data: eventData,
        Address: log.address,
      };
    }) || [];

  return {
    Transaction_ID: transactionHash,
    Block_Number: Number(blockNumber),
    Status: status.toString() === "1" ? "Success ✅" : "Failed ❌",
    From: from,
    To: to,
    Gas_Used: Number(gasUsed),
    Gas_Price_Gwei: gasPriceGwei.toFixed(4) + " Gwei",
    Total_Fee_ETH: totalFeeEth.toFixed(6) + " ETH",
    Logs: parsedLogs,
  };
}

export function stringifyBigInts(obj: any): any {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map((item) => stringifyBigInts(item));
  } else if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = stringifyBigInts(value);
    }
    return newObj;
  }
  return obj;
}

export function toCapitalized(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const isOwner = (address: string, nft: NFTProps): boolean => {
  if (address) return address.toLowerCase() === nft.owner.address.toLowerCase();
  return false;
};

export async function blobToFile(blobType: string, imageName: string) {
  try {
    const res = await fetch(blobType, { method: "GET" });

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }

    const blob = await res.blob();

    // Extract file extension from blob type
    const extension = blob.type.split("/")[1] || "png"; // Default to png if unknown

    // Ensure the filename has the correct extension
    const finalFileName = imageName.includes(".")
      ? imageName
      : `${imageName}.${extension}`;

    const file = new File([blob], finalFileName, { type: blob.type });

    console.log(file);
    return file;
  } catch (e: any) {
    console.log(e.message);
  }
}
