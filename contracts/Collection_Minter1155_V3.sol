// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";

import "./Minter1155_V3.sol";

contract Collection_Minter1155_V3 is
    OwnableUpgradeable,
    UUPSUpgradeable,
    CloneFactory
{
    using AddressUpgradeable for address;
    // struct MinterMetaData {
    //     string _name;
    //     address _address;
    //     uint256 index;
    // }
    // MinterMetaData[] Collections;

    string private _name;

    mapping(uint256 => address) private CollectionsAddressByIndex;
    mapping(uint256 => string) private CollectionsNameByIndex;

    mapping(string => address) private CollectionsAddressByName;
    mapping(string => uint256) private CollectionsIndexByName;
    
    mapping(address => string)  private CollectionsNameByAddress;
    mapping(address => uint256)  private CollectionsIndexByAddress;
    
    uint256 private CollectionCount = 0;

    address private FactoryContract;

    event InstanceCreated(
        address indexed instanceAddress,
        string name_,
        string symbol_
    );

    event InstanceCreatedStart(
        address caller,
        address owner,
        string name_,
        string symbol_
    );

    event FactoryContractUpdated(address indexed address_);

    modifier isContract(address _addr) {
        require(_addr != address(0));
        require(_addr.isContract());
        _;
    }

    function init() external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function createMinter(string memory name_, string memory symbol_)
        external
        onlyOwner
        isContract(FactoryContract)
        returns (address)
    {
        if (CollectionsAddressByName[name_] != address(0)) {
            return CollectionsAddressByName[name_];
        }

        emit InstanceCreatedStart(_msgSender(), owner(), name_, symbol_);

        address minter = createClone(FactoryContract);
        Minter1155_V3(minter).init();
        Minter1155_V3(minter).setData(name_, symbol_);

        /*
        mapping(uint256 => address) private CollectionsAddressByIndex;
        mapping(uint256 => string) private CollectionsNameByIndex;

        mapping(string => address) private CollectionsAddressByName;
        mapping(string => uint256) private CollectionsIndexByName;
        
        mapping(address => string)  private CollectionsNameByAddress;
        mapping(address => uint256)  private CollectionsIndexByAddress;
        */
        CollectionsAddressByIndex[CollectionCount] = minter;
        CollectionsNameByIndex[CollectionCount] = name_;

        CollectionsAddressByName[name_] = minter;
        CollectionsIndexByName[name_] = CollectionCount;
        
        CollectionsNameByAddress[minter] = name_;
        CollectionsIndexByAddress[minter] = CollectionCount;
        
        CollectionCount++;
        
        emit InstanceCreated(minter, name_, symbol_);

        return minter;
    }

    function setFactory(address FactoryContractAddress)
        external
        onlyOwner
        isContract(FactoryContractAddress)
        returns (address)
    {
        FactoryContract = FactoryContractAddress;

        emit FactoryContractUpdated(FactoryContract);

        return FactoryContract;
    }

    function getFactoryAddress()
        external
        view
        virtual
        onlyOwner
        returns (address)
    {
        return FactoryContract;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function setName(string memory name_) external onlyOwner {
        _name = name_;
    }

    function checkCollectionByName(string memory CollectionName)
        external
        view
        virtual
        returns (bool)
    {
        return (CollectionsAddressByName[CollectionName] != address(0));
    }

    function checkCollectionByAddress(address CollectionAddress)
        external
        view
        virtual
        returns (bool)
    {
        return (bytes(CollectionsNameByAddress[CollectionAddress]).length > 0);
    }

    function checkCollection(uint256 CollectionIndex)
        external
        view
        virtual
        returns (bool)
    {
        return (CollectionsAddressByIndex[CollectionIndex] != address(0));
    }

    function getCollectons()
        public
        view
        returns (uint256[] memory, string[] memory, address[] memory)
    {

        /*
        mapping(uint256 => address) private CollectionsAddressByIndex;
        mapping(uint256 => string) private CollectionsNameByIndex;

        mapping(string => address) private CollectionsAddressByName;
        mapping(string => uint256) private CollectionsIndexByName;
        
        mapping(address => string)  private CollectionsNameByAddress;
        mapping(address => uint256)  private CollectionsIndexByAddress;
        */
        uint256[] memory CollectionIndexes = new uint256[](CollectionCount);
        string[] memory CollectionNames = new string[](CollectionCount);
        address[] memory CollectionAddresses = new address[](CollectionCount);

        for(uint256 i = 0 ; i < CollectionCount; i++) {
            CollectionIndexes[i] = i;
            CollectionNames[i] = CollectionsNameByIndex[i];
            CollectionAddresses[i] = CollectionsAddressByIndex[i];
        }
        return (CollectionIndexes, CollectionNames, CollectionAddresses);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
