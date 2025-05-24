# 🖼️ NFT Marketplace

A full-stack NFT Marketplace dApp where users can **mint**, **list**, **buy**, and **cancel NFTs** — powered entirely by **Next.js** for both frontend and backend logic.

---

## 🚀 Features

- 🛠️ **Mint NFTs** with metadata stored on IPFS via Pinata.
- 🛒 **List NFTs** for sale, with price and ownership tracked.
- 💳 **Buy NFTs** through MetaMask wallet integration.
- ❌ **Cancel Listings** anytime before purchase.
- 🔁 **Resell NFTs** by relisting after buying.
- 📦 **MongoDB Storage** for listing data and activity logs.

---

## 🧰 Stack Overview

| Layer        | Tech Stack                     |
|-------------|--------------------------------|
| Smart Contract | Solidity (ERC-721) + Truffle |
| Frontend + API | Next.js (App Router)          |
| Blockchain Interact | Web3.js + MetaMask       |
| DB & API | MongoDB + Mongoose |
| File Storage | IPFS via Pinata |

---

## 📦 Project Structure
nft-market/
├── contracts/ # Solidity smart contracts
├── migrations/ # Truffle deployment scripts
├── app/ # Next.js App Router (frontend + backend routes)
├── lib/ # contract libraries
├── models/ # Mongoose models
├── public/ # Static assets
├── test/ # Contract test
├── truffle-config.js # Truffle configuration
└── .env # Environment variables


---

## ⚙️ Environment Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nft-marketplace.git
cd nft-marketplace

### Contract installation
npm install 

### frontend installation
cd client
npm install 

### Create an .env-local in the client folder
NEXT_PUBLIC_MONGODB_URI=
NEXT_PUBLIC_SESSION_SECRET=
NEXT_PUBLIC_PINANTA_API_KEY=
NEXT_PUBLIC_PINANTA_APIAPI_SECRET=
NEXT_PUBLIC_PINANTA_API_JWT=
NEXT_PUBLIC_NFT_ADDRESS=
NEXT_PUBLIC_NFT_MARKET_ADDRESS=
NEXT_PUBLIC_SEPOLIA_CHAIN_ID=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
NEXT_PUBLIC_GATEWAY_URL=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

### start frontend 
    ### root directory
        npm run dev
    ### client directory
        cd client && npm run dev

### Local contract development 
    truffle compile
    truffle migrate --network development
    # or to testnet:
    truffle migrate --network sepolia


🔄 NFT Flow
🖼️ Mint NFT → Metadata sent to IPFS via Pinata

📝 List the NFT for sale → Stored in MongoDB

💰 Buy NFT → NFT ownership transferred via contract

🔄 Resell or ❌ Cancel listings

🛡️ Security Notes
Smart contracts enforce ownership + approval.

MetaMask handles all wallet interactions.

Server-side listing logic validates all requests against blockchain state.

📤 Deployment (Vercel + MongoDB Atlas)
This project is deployable to Vercel:

Push to GitHub

Connect repo on vercel.com

Set environment variables under project settings

Deploy!

📜 License
MIT License

👋 Author
## 👋 Author

- GitHub: [@dannymmcall](https://github.com/dannymccall)
- Twitter: [@_nana_bekoe_](https://twitter.com/_nana_bekoe)