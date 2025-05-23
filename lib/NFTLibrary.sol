// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
library NFTLibrary {
    function safeTransfer(address _nftContract, address _to, uint256 _tokenId) internal {
       IERC721(_nftContract).safeTransferFrom(msg.sender, _to, _tokenId);
    }
}