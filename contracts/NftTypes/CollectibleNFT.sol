// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './utils/CosmicMintable.sol';

contract CollectibleNFT is CosmicMintable {
    enum CClasses {
        PROFILE_PIC,
        SKIN,
        MUSIC
    }

    // Props important for further logic
    struct CMetadata {
        string uri;
        CClasses class;
        Rarity rarity; // 0-4 (Normal- rare)
        uint256 index;
        // We may add more props as intended
    }

    mapping(uint256 => CMetadata) public cIndexMapping;

    uint256[] cIds;

    function _setupCNFT(
        string memory _uri,
        uint8 _class,
        uint8 _rarity,
        uint256 id
    ) internal {
        CClasses class = CClasses(_class); // This will automatically check whether this is legal or not
        Rarity rarity = Rarity(_rarity);
        cIndexMapping[id] = CMetadata(_uri, class, rarity, id);
        emit CosmicNftMinted('Collectible', rarity, _uri, id, msg.sender);

        cIds.push(id);
    }

    function _listCNFTs() internal view returns (CMetadata[] memory) {
        CMetadata[] memory cNFts = new CMetadata[](cIds.length);
        for (uint256 i = 0; i < cIds.length; i++) {
            cNFts[i] = cIndexMapping[cIds[i]];
        }
        return cNFts;
    }
}
