// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./Everywhere_TowerDefense_Minter1155_V1.sol";

contract CloneFactory {

  function createClone(address target) internal returns (address result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(clone, 0x14), targetBytes)
      mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, clone, 0x37)
    }
  }

  function isClone(address target, address query) internal view returns (bool result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
      mstore(add(clone, 0xa), targetBytes)
      mstore(add(clone, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

      let other := add(clone, 0x40)
      extcodecopy(query, other, 0, 0x2d)
      result := and(
        eq(mload(clone), mload(other)),
        eq(mload(add(clone, 0xd)), mload(add(other, 0xd)))
      )
    }
  }
}

contract _Everywhere_TowerDefense_Collection_Minter1155_V1 is Initializable, OwnableUpgradeable, UUPSUpgradeable,
CloneFactory {

    string private _name;

    mapping(string => address) private Collections;

    address private FactoryContract;

    event InstanceCreated(address indexed address_, string name_, string symbol_);
    event FactoryContractUpdated(address indexed address_);

    modifier isContract(address _addr) {
        require(FactoryContract != address(0));
        require(FactoryContract != address(0));
        require(AddressUpgradeable.isContract(_addr));
        _;
    }

    function initialize() initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    function create(string memory name_, string memory symbol_) public onlyOwner isContract(FactoryContract) returns(address) {

        if(Collections[name_] == address(0)) {

            address clone = createClone(FactoryContract);
            
            _Everywhere_TowerDefense_Minter1155_V1(clone).initialize();
            _Everywhere_TowerDefense_Minter1155_V1(clone).setData(name_, symbol_);
            
            Collections[name_] = clone;

            emit InstanceCreated(clone, name_, symbol_);

            return clone;
        }

        return Collections[name_];
    }

    function setFactory(address FactoryContractAddress) public onlyOwner returns(address) {
        FactoryContract = FactoryContractAddress;

        emit FactoryContractUpdated(FactoryContract);

        return FactoryContract;
    }

    function getFactoryAddress() public view onlyOwner returns(address) {
      return FactoryContract;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function setName(string memory name_) public onlyOwner {
      _name = name_;
    }

    function checkCollection(string memory CollectionName) public view virtual returns (address) {
        return Collections[CollectionName];
    }
}