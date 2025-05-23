// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./../lib/NFTLibrary.sol";

contract MyNFTMarketplace is ReentrancyGuard, IERC721Receiver {
    uint256 private _listingId = 1;
    uint256 private feePercent = 250;
    address private feeRecipient;

    struct Listing {
        uint256 id;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool sold;
        bool active;

    }

    mapping(uint256 => Listing) private listings;
    event NFTListed(
        uint256 indexed id,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event NFTSold(uint256 indexed id, address indexed buyer);
    event ListingCanceled(uint256 indexed id);
    event DebugCheckpoint(string message);
    event DebugFee(uint256 fee, uint256 price, uint256 feePercent);

    constructor(address payable _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    function getFeeRecipient() external view returns (address) {
        return feeRecipient;
    }

    modifier isApprovedOrOwner(address _nftContract, uint256 _tokenId) {
        IERC721 nft = IERC721(_nftContract);
        require(
            msg.sender == nft.ownerOf(_tokenId) ||
                nft.getApproved(_tokenId) == msg.sender ||
                nft.isApprovedForAll(nft.ownerOf(_tokenId), msg.sender),
            "Not approved or owner"
        );
        _;
    }
    modifier onlySeller(address _nftContract, uint256 _tokenId) {
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "Not the seller"
        );
        _;
    }

    // modifier ownerOf(address _nftContract, uint256 _tokenId){
    //     require(IERC721(_nftContract).ownerOf(_tokenId) == msg.sender, "Caller no longer holds NFT");
    //     _;
    // }
    function listNFT(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    )
        external
        isApprovedOrOwner(_nftContract, _tokenId)
        onlySeller(_nftContract, _tokenId)
    {
        require(_price > 0, "Price must be greater than 0");

        // IERC721 nft = IERC721(_nftContract);

        require(msg.sender != address(0), "Invalid address");

        // nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        NFTLibrary.safeTransfer(_nftContract, address(this), _tokenId);

        listings[_listingId] = Listing(
            _listingId,
            msg.sender,
            _nftContract,
            _tokenId,
            _price,
            false,
            true
        );


        emit NFTListed(_listingId, msg.sender, _nftContract, _tokenId, _price);
        _listingId++;

    }

    function buyNFT(uint256 _tokenId, uint256 _listedId) external payable {
        Listing storage listing = listings[_listedId];
        require(!listing.sold, "NFT not listed for sale");
        require(msg.value >= listing.price, "Insufficient ETH sent");
        require(listing.seller != msg.sender, "Cannot buy your own NFT");
        uint256 fee = (listing.price * feePercent) / 10000;
        uint256 sellerAmount = listing.price - fee;

        emit DebugFee(fee, listing.price, feePercent);

        require(fee > 0, "Fee must be greater than zero");

        //  payable(feeRecipient).transfer(fee);
        (bool sentFee, ) = payable(feeRecipient).call{value: fee}("");
        require(sentFee, "Failed to send fee to recipient");

        (bool sentSeller, ) = payable(listing.seller).call{value: sellerAmount}(
            ""
        );
        require(sentSeller, "Failed to send funds to seller");

        listing.sold = true;
        listing.active = false;
        
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        uint256 excess = msg.value - listing.price;
        if (excess > 0) {
            (bool refunded, ) = payable(msg.sender).call{value: excess}("");
            require(refunded, "Refund failed");
        }

        emit NFTSold(_tokenId, msg.sender);
    }

    function getAllListing() public view returns (Listing[] memory) {
        uint256 totalListings = _listingId;
        Listing[] memory allListings = new Listing[](totalListings);
        for (uint256 i = 0; i < totalListings; i++) {
            allListings[i] = listings[i];
        }
        return allListings;
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(!listing.sold, "Already sold");
        require(listing.seller == msg.sender, "Not your listing");

        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        delete listings[listingId];
        emit ListingCanceled(_listingId);
    }

    function onERC721Received(
        address, //operator,
        address, // from,
        uint256, // tokenId,
        bytes calldata // data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function returnListing(uint256 listingId)
        external
        view
        returns (Listing memory)
    {
        return listings[listingId];
    }
}
