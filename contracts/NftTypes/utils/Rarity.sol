// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

abstract contract HasRarity {
    enum Rarity {
        NORMAL,
        RARE,
        EPIC,
        LEGENDARY,
        COSMIC
    }
}
