// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Minter1155_V31 is Ownable, Initializable, ERC1155Supply, ERC1155URIStorage, ERC1155Holder {
    string private _name;
    string private _symbol;

    event InternalInitialized(address address_);
    event DataSet(address address_, string name_, string symbol_);
    event Minted(address address_, address sender, uint256 tokenId, uint256 supply, string uri);

    constructor() ERC1155("") {}

    function init(address owner) external onlyOwner initializer {
        _transferOwnership(owner);
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155Receiver, ERC1155) returns (bool) {
        return ERC1155Receiver.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155Supply, ERC1155) {
        ERC1155Supply._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uri(uint256 tokenId)
        public
        view override(ERC1155URIStorage, ERC1155)
        returns(string memory)
    {
        return ERC1155URIStorage.uri(tokenId);
    }

    function setData(string memory name_, string memory symbol_) external onlyOwner {
        _name = name_;
        _symbol = symbol_;

        emit DataSet(address(this), _name, _symbol);
    }

    function mint(string memory _uri, uint256 tokenId, uint256 supply) external onlyOwner {
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
}