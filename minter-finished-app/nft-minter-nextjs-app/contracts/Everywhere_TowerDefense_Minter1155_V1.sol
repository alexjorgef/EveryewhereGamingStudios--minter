// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract _Everywhere_TowerDefense_Minter1155_V1 is Initializable, OwnableUpgradeable, UUPSUpgradeable,
ERC1155Upgradeable, ERC1155SupplyUpgradeable, ERC1155URIStorageUpgradeable {
    string private _name;
    string private _symbol;

    event InternalInitialized(address address_);
    event DataSet(address address_, string name_, string symbol_);

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

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

    function uri(uint256 tokenId)
        public
        view override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable)
        returns(string memory)
    {
        return ERC1155URIStorageUpgradeable.uri(tokenId);
    }

    function initialize() initializer public {
        __Ownable_init();
        __ERC1155_init("");
        __ERC1155Supply_init();
        __UUPSUpgradeable_init();
        __ERC1155URIStorage_init();

        emit InternalInitialized(address(this));
    }

    function setData(string memory name_, string memory symbol_) public onlyOwner payable {
        _name = name_;
        _symbol = symbol_;

        emit DataSet(address(this), _name, _symbol);
    }

    function mint(string memory _uri, uint256 tokenId, uint256 supply) public onlyOwner payable {
        _mint(msg.sender, tokenId, supply, "");
        _setURI(tokenId, _uri);
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }
}