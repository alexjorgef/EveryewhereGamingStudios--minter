// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.16;

contract Child{
    uint public data;
    
    // use this function instead of the constructor
    // since creation will be done using createClone() function
    function init(uint _data) external {
        data = _data;
    }
}