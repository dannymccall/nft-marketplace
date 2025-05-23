const MyNFTMarketplace = artifacts.require("MyNFTMarketplace");
const MyNFT = artifacts.require("MyNFT");

contract("MyNFTMarketplace", (accounts) => {
    let marketplace;
    let nft;

    before(async () => {
        marketplace = await MyNFTMarketplace.deployed();
        nft = await MyNFT.deployed();
    });

    it("should list an NFT for sale and allow users buy NFT", async () => {
        // Mint an NFT first
        console.log('account 1:',accounts[1] )
        await nft.mintNFT("https://dummy/metadata.json", {from: accounts[1]});
        // let owner;
        let owner = await nft.checkOwnerOf(0);
        assert.equal(owner, accounts[1], `Owner should be equal to this: ${accounts[1]}`)
        await nft.approve(marketplace.address,0,{from :accounts[1]});
        // Check the approval status
        const approvedAddress = await nft.getApproved(0);
        assert.equal(approvedAddress, marketplace.address, "Marketplace should be approved to transfer the NFT");
        
        // List the NFT for sale
        await marketplace.listNFT(nft.address, 0, web3.utils.toWei("1", "ether"), {from: accounts[1]});
        
        // Check if the NFT is listed
        const listings = await marketplace.getAllListing();

        const listing = await marketplace.returnListing(1);
        assert.equal(listing.price, web3.utils.toWei("1", "ether"), "Price should be 1 ether");
        assert.equal(listing.seller, accounts[1], "Seller should be the account that listed the NFT");

        console.log('account 1:',accounts[2] )

        await marketplace.buyNFT(1, {from: accounts[2], value: web3.utils.toWei('2', 'ether')});
        owner = await nft.checkOwnerOf(0);
        console.log({owner})
        assert.equal(owner, accounts[2], `Owner should be equal to this: ${accounts[2]}`)

    });

    it("should list NFT for sale and the cancel it", async () => {
        await nft.mintNFT("https://dummy/metadata.json", {from: accounts[1]});

        await nft.approve(marketplace.address,0,{from :accounts[1]});

        await marketplace.listNFT(nft.address, 0, web3.utils.toWei("1", "ether"), {from: accounts[1]});


        await marketplace.cancelListing(1, {from: accounts[1]})
    })

})