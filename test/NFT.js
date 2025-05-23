const MyNFT = artifacts.require('MyNFT');

contract("MyNFT", (accounts) => {
    let nft;

    before(async () => {
        nft = await MyNFT.deployed();
    });

    it("should mint NFT Token and check owner", async () => {
        // Mint an NFT from accounts[1]
        const mintNFT = await nft.mintNFT("https://dummy/metadata.json", {from: accounts[1]});
        console.log(mintNFT.logs[0].args.tokenId.toString())
        // Check the owner
        const owner = await nft.checkOwnerOf(0);
        assert.equal(owner, accounts[1], "Owner of token ID 0 should be accounts[1]");
    });

    it("should increase the token counter after minting", async () => {
        const counter = await nft.tokenCounter();
        assert.equal(counter.toString(), "1", "Token counter should now be 1 after minting one NFT");
    });

    it("should return 0 ether balance for contract initially", async () => {
        const balance = await nft.contractBalance();
        assert.equal(balance.toString(), "0", "Contract balance should be 0");
    });

    it("should not allow non-owners to check ownership of a non-existent token", async () => {
        try {
            await nft.checkOwnerOf(99); // Token ID 99 does not exist
            assert.fail("The checkOwnerOf should have thrown an error for non-existent token!");
        } catch (error) {
            assert(error, "Expected an error but none was thrown");
        }
    });
});
