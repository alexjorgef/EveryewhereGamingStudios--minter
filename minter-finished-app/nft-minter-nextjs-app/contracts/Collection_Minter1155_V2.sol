// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./CloneFactory.sol";
import "./Minter1155_V2.sol";

contract Collection_Minter1155_V2 is Ownable {
    string private _name;

    Minter1155_V2[] private Collections;
    mapping(string => address) private CollectionsByName;
    mapping(string => uint256) private CollectionsByIndex;

    address private FactoryContract;

    event InstanceCreated(Minter1155_V2 indexed instanceAddress, string name_, string symbol_);
    event InstanceCreatedStart(address caller, address owner, string name_, string symbol_);
    event FactoryContractUpdated(address indexed address_);

    modifier isContract(address _addr) {
        require(_addr != address(0));
        require(Address.isContract(_addr));
        _;
    }
    
    function createMinter(string memory name_, string memory symbol_) external onlyOwner isContract(FactoryContract) returns(address) {
        if(CollectionsByName[name_] != address(0)) {
            return CollectionsByName[name_];
        }

        emit InstanceCreatedStart(_msgSender(), owner(), name_, symbol_);

        Minter1155_V2 minter = new Minter1155_V2();//Minter1155_V1(createClone(FactoryContract));
        
        minter.setData(name_, symbol_);

        minter.init(_msgSender());
        
        Collections.push(minter);
        CollectionsByName[name_] = address(minter);
        CollectionsByIndex[name_] = Collections.length-1;

        emit InstanceCreated(minter, name_, symbol_);

        return address(minter);
    }

    function setFactory(address FactoryContractAddress) external onlyOwner isContract(FactoryContractAddress) returns(address) {
        FactoryContract = FactoryContractAddress;

        emit FactoryContractUpdated(FactoryContract);

        return FactoryContract;
    }

    function getFactoryAddress() external view onlyOwner returns(address) {
        return FactoryContract;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function setName(string memory name_) external onlyOwner {
        _name = name_;
    }

    function checkCollection(string memory CollectionName) external view virtual returns (address) {
        return CollectionsByName[CollectionName];
    }

    function getCollectons() external view returns(Minter1155_V2[] memory){
         return Collections;
     }
}