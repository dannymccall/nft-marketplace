const MyNFT = artifacts.require("MyNFT");
const MyNFTMarketplace = artifacts.require("MyNFTMarketplace");
module.exports = async function(deployer) {
  // Deploy MyNFT contract
  await deployer.deploy(MyNFT);
  const myNFTInstance = await MyNFT.deployed();

  // Deploy MyNFTMarketplace contract with the address of MyNFT contract
  await deployer.deploy(MyNFTMarketplace, myNFTInstance.address);
  const myNFTMarketplaceInstance = await MyNFTMarketplace.deployed();

  // Set the marketplace address in the MyNFT contract
//   await myNFTInstance.setMarketplace(myNFTMarketplaceInstance.address);
}
