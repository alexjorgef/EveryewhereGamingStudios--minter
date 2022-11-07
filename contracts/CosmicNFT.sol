// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

import './NftTypes/Stage0NFT.sol';
import './NftTypes/CollectibleNFT.sol';
import './NftTypes/WithstandKairosNFT.sol';
import './NftTypes/utils/Rarity.sol';

contract CosmicNFT is ERC721URIStorage, HasRarity, Ownable, Stage0NFT, CollectibleNFT, WithstandKairosNFT {
    struct CosmicCollection {
        S0Metadata[] s0NFTs;
        WkMetadata[] wkNFTs;
        CMetadata[] cNFTs;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    uint256[] public cosmicNfts;

    function mint(string memory _uri) internal {
        _safeMint(msg.sender, cosmicNfts.length);
        _setTokenURI(cosmicNfts.length, _uri);
    }

    function mintStage0Nft(
        string memory _uri,
        uint8 _class,
        uint8 _rarity
    ) external onlyOwner {
        mint(_uri);
        _setupS0NFT(_uri, _class, _rarity, cosmicNfts.length);
        cosmicNfts.push(cosmicNfts.length);
    }

    function mintWithstandKairosNFT(
        string memory _uri,
        uint8 _class,
        uint8 _rarity
    ) external onlyOwner {
        mint(_uri);
        _setupWkNFT(_uri, _class, _rarity, cosmicNfts.length);
        cosmicNfts.push(cosmicNfts.length);
    }

    function mintCollectibleNFT(
        string memory _uri,
        uint8 _class,
        uint8 _rarity
    ) external onlyOwner {
        mint(_uri);
        _setupCNFT(_uri, _class, _rarity, cosmicNfts.length);
        cosmicNfts.push(cosmicNfts.length);
    }

    function listS0NFTs() external view returns (S0Metadata[] memory) {
        return _listS0NFTs();
    }

    function listWkNFTs() external view returns (WkMetadata[] memory) {
        return _listWkNFTs();
    }

    function listCNFTs() external view returns (CMetadata[] memory) {
        return _listCNFTs();
    }

    function listAllNFTs() external view returns (CosmicCollection memory) {
        CosmicCollection memory _cosmicCollection = CosmicCollection(_listS0NFTs(), _listWkNFTs(), _listCNFTs());
        return _cosmicCollection;
    }

    function getMintedAmount() external view returns (uint256 _size) {
        _size = cosmicNfts.length;
    }
}
