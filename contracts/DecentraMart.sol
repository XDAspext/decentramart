// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DecentraMart {
    struct Listing {
        uint256 id;
        address payable seller;
        address buyer;
        uint256 price;
        bool available;
        string metadataURI;
    }
    uint256 public nextListingId = 1;
    mapping(uint256 => Listing) public listings;
    event ProductListed(uint256 indexed id, address indexed seller, uint256 price, string metadataURI);
    event ProductPurchased(uint256 indexed id, address indexed buyer, address indexed seller, uint256 price);

    function listProduct(uint256 price, string calldata metadataURI) external returns (uint256 id) {
        require(price > 0, "price must be positive");
        require(bytes(metadataURI).length > 0, "metadata required");
        id = nextListingId++;
        listings[id] = Listing(id, payable(msg.sender), address(0), price, true, metadataURI);
        emit ProductListed(id, msg.sender, price, metadataURI);
    }

    function purchase(uint256 id) external payable {
        Listing storage item = listings[id];
        require(item.id != 0, "invalid listing");
        require(item.available, "listing unavailable");
        require(msg.sender != item.seller, "seller cannot buy own listing");
        require(msg.value == item.price, "incorrect payment");
        // Checks-effects-interactions: mark unavailable before calling seller.
        item.available = false;
        item.buyer = msg.sender;
        (bool ok, ) = item.seller.call{value: msg.value}("");
        require(ok, "seller payment failed");
        emit ProductPurchased(id, msg.sender, item.seller, msg.value);
    }
}
