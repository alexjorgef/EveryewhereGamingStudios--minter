// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract _Everywhere_TowerDefense_Minter1155 is OwnableUpgradeable, ERC1155Upgradeable, ERC1155SupplyUpgradeable, ERC1155URIStorageUpgradeable {
    string private _name;

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
        ERC1155SupplyUpgradeable._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uri(uint256 tokenId) public view override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable) returns(string memory) {
        return ERC1155URIStorageUpgradeable.uri(tokenId);
    }

    function initialize(string memory name_) initializer public {      
      __Ownable_init();
      _name = name_;
    }

    function mint(string memory _uri, uint256 tokenId, uint256 supply) public payable {
        _mint(msg.sender, tokenId, supply, "");
        _setURI(tokenId, _uri);
    }
}