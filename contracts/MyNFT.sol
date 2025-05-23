// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    function mintNFT(string memory _tokenURI) public returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenCounter++;
        return tokenId;
    }

    // ❌ REMOVE this function entirely!
    // You do NOT need to override _burn — ERC721URIStorage already handles it.

    // ✅ Keep this
    function tokenURI(uint256 tokenId) 
        public
        view
        override 
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function checkBalance(address owner) public view returns (uint256) {
        return balanceOf(owner);
    }

    receive() external payable {}

    fallback() external payable {}

    function test() public pure returns (uint256) {
        return 42;
    }

    function checkOwnerOf(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
