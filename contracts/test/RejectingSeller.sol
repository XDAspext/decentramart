// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMarketplaceForTest {
    function listProduct(uint256 price, string calldata metadataURI) external returns (uint256 id);
}

/// @dev Test fixture that can list products but always rejects incoming ETH.
contract RejectingSeller {
    function list(address marketplace, uint256 price) external {
        IMarketplaceForTest(marketplace).listProduct(price, "test://rejecting-seller");
    }

    receive() external payable {
        revert("seller rejects payment");
    }
}
