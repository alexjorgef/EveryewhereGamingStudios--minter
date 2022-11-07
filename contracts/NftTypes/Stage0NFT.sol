// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './utils/CosmicMintable.sol';

contract Stage0NFT is CosmicMintable {
    enum S0Classes {
        AVATAR,
        WORKER,
        BUILDING,
        ITEMS,
        EQUIPMENT
    }

    // Props important for further logic
    struct S0Metadata {
        string uri;
        S0Classes class;
        Rarity rarity; // 0-4 (Normal- rare)
        uint256 index;
        // We may add more props as intended
    }

    mapping(uint256 => S0Metadata) public s0IndexMapping;

    uint256[] public s0Ids;

    function _setupS0NFT(
        string memory _uri,
        uint8 _class,
        uint8 _rarity,
        uint256 id
    ) internal {
        S0Classes class = S0Classes(_class); // This will automatically check whether this is legal or not
        Rarity rarity = Rarity(_rarity);
        s0IndexMapping[id] = S0Metadata(_uri, class, rarity, id);
        emit CosmicNftMinted('Stage0', rarity, _uri, id, msg.sender);
        s0Ids.push(id);
    }

    function _listS0NFTs() internal view returns (S0Metadata[] memory) {
        S0Metadata[] memory s0NFts = new S0Metadata[](s0Ids.length);
        for (uint256 i = 0; i < s0Ids.length; i++) {
            s0NFts[i] = s0IndexMapping[s0Ids[i]];
        }
        return s0NFts;
    }
}
