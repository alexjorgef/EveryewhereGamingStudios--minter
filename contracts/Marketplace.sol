// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@chainlink/contracts/src/v0.8/KeeperCompatible.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Marketplace is ReentrancyGuard, KeeperCompatible, Ownable {
    enum PurchaseType {
        HIGHEST_BID,
        BUYOUT
    }

    enum AuctionDuration {
        ZERO_DAYS,
        ONE_DAY,
        TWO_DAYS,
        THREE_DAYS
    }

    address payable public immutable feeAccount;
    uint256 public immutable feePercentage;
    uint256 itemCount;

    address[] public whitelistedAddresses;

    struct Bid {
        address bidder;
        uint256 amount;
    }

    struct Item {
        uint256 itemId;
        IERC721 nftContract;
        uint256 tokenId;
        uint256 bidStartPrice;
        uint256 auctionDuration;
        uint256 buyoutPrice;
        address payable seller;
        Bid lastBid;
        bool sold;
        uint256 auctonStartTimestamp;
    }

    mapping(uint256 => Item) public items;

    uint256[] public itemsForSale;

    event Listed(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 bidStartPrice,
        AuctionDuration auctionDuration,
        uint256 buyoutPrice,
        address indexed seller,
        uint256 timestamp
    );

    event BidRequest(uint256 itemId, address indexed bidder, uint256 amount, uint256 timestamp);

    event ItemPurchased(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        PurchaseType purhcaseType,
        address indexed seller,
        address indexed buyer,
        uint256 timestamp
    );

    constructor(uint256 _feePercent, address _feeAccount) {
        feeAccount = payable(_feeAccount);
        feePercentage = _feePercent;
    }

    function makeItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _bidStartPrice,
        uint256 _buyoutPrice,
        AuctionDuration _auctionDuration
    ) external nonReentrant isWhitelisted(_nft) {
        require(_buyoutPrice > 0, 'Price must be higher than zero');

        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _bidStartPrice,
            uint256(_auctionDuration) * 24 * 60 * 60,
            _buyoutPrice,
            payable(msg.sender),
            Bid(address(0), 0),
            false,
            block.timestamp
        );

        emit Listed(
            itemCount,
            address(_nft),
            _tokenId,
            _bidStartPrice,
            _auctionDuration,
            _buyoutPrice,
            msg.sender,
            block.timestamp
        );

        itemsForSale.push(itemCount);
        itemCount++;
    }

    function buyoutItem(uint256 _itemId) external payable nonReentrant {
        _processBuyout(_itemId, msg.value);
    }

    // TODO lock funds and release after bid is overriden?????
    function makeBidOnItem(uint256 _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(msg.sender != item.seller, 'Seller is not allowed to make bids');
        require(!item.sold, 'Item not for sale anymore');
        if (item.lastBid.amount == 0) {
            // First bid
            require(msg.value >= item.bidStartPrice, 'Amount provided is lower than minimum bid price');
        } else {
            // Subsequent bids
            require(msg.value > item.lastBid.amount, 'Amount provided is lower or equal to last bid');
        }

        // In case this is the first bid, jump over this
        if (item.lastBid.bidder != address(0)) _refundLastBid(item);

        // Update bid values
        item.lastBid.amount = msg.value;
        item.lastBid.bidder = msg.sender;

        emit BidRequest(_itemId, msg.sender, msg.value, block.timestamp);

        // In case bid is higher that buyout, proceed with buyout
        if (msg.value >= item.buyoutPrice) {
            _closeAuction(item);
        }
    }

    // Private utils

    function _removeItemFromSalesArray(uint256 _itemId) private {
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (itemsForSale[i] == _itemId) {
                itemsForSale[i] = itemsForSale[itemsForSale.length - 1];
                itemsForSale.pop();
            }
        }
    }

    function _refundLastBid(Item storage item) private returns (bool) {
        // Checks
        Bid memory previousBid = Bid(item.lastBid.bidder, item.lastBid.amount);
        // Interactions
        (bool success, ) = payable(item.lastBid.bidder).call{value: item.lastBid.amount}(''); // Full refund from last bid
        if (success) {
            return success;
        } else {
            revert('Error transfering back last bid');
        }
    }

    function _closeAuction(Item storage item) private {
        // In case no bid was made, return asset to user without any side effects
        if (item.lastBid.amount == 0) {
            _removeItemFromSalesArray(item.itemId);
            item.nftContract.transferFrom(address(this), item.seller, item.tokenId);
            return;
        }

        // Update item status
        item.sold = true;

        // Transfer asset to final bidder
        uint256 fee = getFee(item.itemId);
        payable(item.seller).call{value: item.lastBid.amount - fee}('');
        payable(feeAccount).call{value: fee}('');
        item.nftContract.transferFrom(address(this), item.lastBid.bidder, item.tokenId);

        _removeItemFromSalesArray(item.itemId);

        emit ItemPurchased(
            item.itemId,
            address(item.nftContract),
            item.tokenId,
            item.buyoutPrice,
            PurchaseType.HIGHEST_BID,
            item.seller,
            msg.sender,
            block.timestamp
        );
    }

    function _processBuyout(uint256 _itemId, uint256 _amount) private {
        Item storage item = items[_itemId];
        // Checks
        require(_itemId >= 0 && _itemId <= itemCount, 'No such item listed');
        require(_amount >= item.buyoutPrice, 'Not enough funds to cover for price and market fee');
        require(!item.sold, 'Item not for sale anymore');
        // Effects
        item.sold = true;
        // Interactions
        uint256 fee = getFee(_itemId);
        payable(item.seller).call{value: item.buyoutPrice - fee}('');
        payable(feeAccount).call{value: fee}('');
        item.nftContract.transferFrom(address(this), msg.sender, item.tokenId);
        _removeItemFromSalesArray(_itemId);
        if (item.lastBid.bidder != address(0)) _refundLastBid(item);

        emit ItemPurchased(
            _itemId,
            address(item.nftContract),
            item.tokenId,
            item.buyoutPrice,
            PurchaseType.BUYOUT,
            item.seller,
            msg.sender,
            block.timestamp
        );
    }

    // Owner actions

    function whitelistNftCollection(address _nftAddress) external onlyOwner {
        whitelistedAddresses.push(_nftAddress);
    }

    function removeWhitelistedAddress(uint256 _idx) external onlyOwner {
        whitelistedAddresses[_idx] = whitelistedAddresses[whitelistedAddresses.length - 1];
        whitelistedAddresses.pop();
    }

    // View functions

    function getFee(uint256 _itemId) public view returns (uint256) {
        return ((items[_itemId].buyoutPrice * feePercentage) / 100);
    }

    function listItems() external view returns (Item[] memory) {
        Item[] memory itemsToReturn = new Item[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            Item storage item = items[i];
            itemsToReturn[i] = item;
        }
        return itemsToReturn;
    }

    function listItemsForSale() public view returns (uint256[] memory) {
        return itemsForSale;
    }

    function getWhitelistedCollections() public view returns (address[] memory) {
        return whitelistedAddresses;
    }

    modifier isWhitelisted(IERC721 _nftAddress) {
        bool whitelisted = false;
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == address(_nftAddress)) {
                whitelisted = true;
                break;
            }
        }
        if (whitelisted == false) {
            revert('Collection not whitelisted');
        }
        _;
    }

    // Keeper Functions

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        uint256[] memory scanArray = new uint256[](itemsForSale.length);
        uint256 auctionsToCloseCount = 0;
        for (uint256 i = 0; i < itemsForSale.length; i++) {
            if (
                block.timestamp - items[itemsForSale[i]].auctonStartTimestamp >= items[itemsForSale[i]].auctionDuration
            ) {
                scanArray[auctionsToCloseCount] = itemsForSale[i];
                auctionsToCloseCount++;
            }
        }
        uint256[] memory auctionsToClose = new uint256[](auctionsToCloseCount);
        for (uint256 a = 0; a < auctionsToCloseCount; a++) {
            auctionsToClose[a] = scanArray[a];
        }
        performData = abi.encode(auctionsToClose);

        upkeepNeeded = auctionsToClose.length > 0;
    }

    function performUpkeep(bytes calldata performData) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        uint256[] memory auctionsToClose = abi.decode(performData, (uint256[]));
        for (uint256 i = 0; i < auctionsToClose.length; i++) {
            _closeAuction(items[auctionsToClose[i]]);
        }
    }
}
