import Web3 from "web3";

const providerUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "";

if (!providerUrl) {
  throw new Error("Missing SEPOLIA_RPC_URL in environment");
}

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

/**
 * Returns Web3 and Contract instances for a given address and ABI
 * @param contractAddress - Deployed contract address
 * @param abi - Contract ABI
 * @returns { web3, contract }
 */
export const getContractInstance = (contractAddress: string, abi: any) => {
  const contract = new web3.eth.Contract(abi, contractAddress);
  return { web3, contract };
};
