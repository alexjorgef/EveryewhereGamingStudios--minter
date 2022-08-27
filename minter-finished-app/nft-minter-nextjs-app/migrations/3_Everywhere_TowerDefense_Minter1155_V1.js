const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const _Everywhere_TowerDefense_Minter1155_V1 = artifacts.require("_Everywhere_TowerDefense_Minter1155_V1");

//@see: https://docs.openzeppelin.com/cli/2.8/truffle
module.exports = async (deployer, network, accounts) => {
    // deployer.deploy(Demo, { from: accounts[0] });
    // console.log(deployer);
    // console.log(network);
    // console.log(accounts);
    const instance = await deployProxy(
        _Everywhere_TowerDefense_Minter1155_V1,
        {
            kind: 'uups',
            initializer: 'initialize',
            from: accounts[0]
        }
    );

    console.log('_Everywhere_TowerDefense_Minter1155_V1: ', instance.address);
};