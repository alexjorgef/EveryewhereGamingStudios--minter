// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './utils/CosmicMintable.sol';

abstract contract WithstandKairosNFT is CosmicMintable {
    enum WkClasses {
        HERO,
        COMPANION,
        TROOP,
        TOWER,
        BARRIER,
        POTIONS,
        FOOD
    }

    // Props important for further logic
    struct WkMetadata {
        string uri;
        WkClasses class;
        Rarity rarity; // 0-4 (Normal- rare)
        uint256 index;
        // We may add more props as intended
    }

    mapping(uint256 => WkMetadata) public wkIndexMapping;

    uint256[] wkIds;

    function _setupWkNFT(
        string memory _uri,
        uint8 _class,
        uint8 _rarity,
        uint256 id
    ) internal {
        WkClasses class = WkClasses(_class); // This will automatically check whether this is legal or not
        Rarity rarity = Rarity(_rarity);
        wkIndexMapping[id] = WkMetadata(_uri, class, rarity, id);
        emit CosmicNftMinted('Withstand Kairos', rarity, _uri, id, msg.sender);
        wkIds.push(id);
    }

    function _listWkNFTs() internal view returns (WkMetadata[] memory) {
        WkMetadata[] memory wkNFts = new WkMetadata[](wkIds.length);
        for (uint256 i = 0; i < wkIds.length; i++) {
            wkNFts[i] = wkIndexMapping[wkIds[i]];
        }
        return wkNFts;
    }
}
