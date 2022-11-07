// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";

contract Minter1155_V3 is
    UUPSUpgradeable,
    OwnableUpgradeable,
    ERC1155SupplyUpgradeable,
    ERC1155URIStorageUpgradeable,
    ERC1155HolderUpgradeable
{
    string private _name;
    string private _symbol;

    event DataSet(address address_, string name_, string symbol_);
    event Minted(
        address address_,
        address sender,
        uint256 tokenId,
        uint256 supply,
        string uri
    );

    function init() external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ERC1155Supply_init();
        __ERC1155URIStorage_init();
        __ERC1155Holder_init();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155Upgradeable, ERC1155ReceiverUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155SupplyUpgradeable, ERC1155Upgradeable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uri(uint256 tokenId)
        public
        view
        override(ERC1155URIStorageUpgradeable, ERC1155Upgradeable)
        returns (string memory)
    {
        return super.uri(tokenId);
    }

    function setData(string memory name_, string memory symbol_)
        external
        onlyOwner
    {
        _name = name_;
        _symbol = symbol_;

        emit DataSet(address(this), _name, _symbol);
    }

    function mint(
        string memory _uri,
        uint256 tokenId,
        uint256 supply
    ) external onlyOwner {
        _mint(_msgSender(), tokenId, supply, "");
        _setURI(tokenId, _uri);
        emit Minted(address(this), _msgSender(), tokenId, supply, _uri);
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
