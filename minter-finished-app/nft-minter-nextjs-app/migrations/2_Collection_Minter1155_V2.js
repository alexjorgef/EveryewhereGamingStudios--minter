const { deployProxy } = require('@openzeppelin/truffle-upgrades');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Collection_Minter1155_V2 = artifacts.require('Collection_Minter1155_V2');
// const ContractTracker = require('../utils/ContractTracker');

// const delay = ms => new Promise(res => setTimeout(res, ms));

console.log('=====================================================');
console.log('RUNNING MIGRATION');
console.log('Collection_Minter1155_V2');
console.log('=====================================================');

//@see: https://docs.openzeppelin.com/cli/2.8/truffle
module.exports = async (deployer, network, accounts) => {
    // deployer.deploy(Demo, { from: accounts[0] });
    // console.log(deployer);
    // console.log(network);
    // console.log(accounts);
    // const run = async () => {
    //     await ContractTracker.init();

    //     if(
    //         ContractTracker.Contracts['_Everywhere_TowerDefense_Collection_Minter1155_V1']
    //         && 
    //         ContractTracker.Contracts['_Everywhere_TowerDefense_Collection_Minter1155_V1'].length > 0
    //     )
    //     {
    //         console.log('_Everywhere_TowerDefense_Collection_Minter1155_V1 exists: ', ContractTracker.Contracts['_Everywhere_TowerDefense_Collection_Minter1155_V1']);
    //         return;  
    //     }

    //     const _Everywhere_TowerDefense_Collection_Minter1155_V1 = artifacts.require('_Everywhere_TowerDefense_Collection_Minter1155_V1');

    //     const instance = await deployProxy(
    //         _Everywhere_TowerDefense_Collection_Minter1155_V1,
    //         {
    //             kind: 'uups',
    //             initializer: 'initialize',
    //             from: accounts[0]
    //         }
    //     );

    //     console.log('_Everywhere_TowerDefense_Collection_Minter1155_V1 new: ', instance.address);
    //     await ContractTracker.track('_Everywhere_TowerDefense_Collection_Minter1155_V1', instance.address);
    // };

    // const runner = run();

    // while(runner.state === 'pending') {
    //     const delayP = delay(100);
    //     while(delayP.state === 'pending') {}
    // }

    try {
        const cm = await Collection_Minter1155_V2.deployed();
        console.log('Collection_Minter1155_V2 already deployed: ', cm.address);
    } catch (e) {
        // const instance = await deployProxy(
        //     Collection_Minter1155_V1,
        //     {
        //         // kind: 'uups',
        //         initializer: 'initialize'
        //     }
        // );

        const instance = await deployer.deploy(Collection_Minter1155_V2);

        console.log('Collection_Minter1155_V2 new: ', instance.address);
        // await ContractTracker.track('_Everywhere_TowerDefense_Collection_Minter1155_V1', instance.address);
    }
};