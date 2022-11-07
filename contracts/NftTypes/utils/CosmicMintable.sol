// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './Rarity.sol';

contract CosmicMintable is HasRarity {
    event CosmicNftMinted(string _collection, Rarity _rarity, string _uri, uint256 _id, address _to);
}
