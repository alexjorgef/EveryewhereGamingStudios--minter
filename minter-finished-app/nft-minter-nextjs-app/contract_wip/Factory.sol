//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import './CloneFactory.sol';
import './Child.sol';

contract Factory is CloneFactory {
     Child[] public children;
     address masterContract;

     constructor(address _masterContract){
         masterContract = _masterContract;
     }

     function createChild(uint data) external{
        Child child = Child(createClone(masterContract));
        child.init(data);
        children.push(child);
     }

     function getChildren() external view returns(Child[] memory){
         return children;
     }
}
