const hardhat = require('hardhat');
const assert = require('assert');

let CM;
let Minter;
let cm;
let m;

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

before('get factories', async () => {
    CM = await hardhat.ethers.getContractFactory('_Everywhere_TowerDefense_Collection_Minter1155_V1');
    // console.log(CM);

    Minter = await hardhat.ethers.getContractFactory('_Everywhere_TowerDefense_Minter1155_V1');
    // console.log(Minter);
});

it('should deploy', async () => {
    cm = await hardhat.upgrades.deployProxy(CM, {kind: 'uups'});
    await cm.deployed();

    assert(await cm.name() === '_Everywhere_TowerDefense_Collection_Minter1155_V1');

    console.log('Address cm: ', cm.address);
    console.log('Owner cm: ', await cm.owner());



    m = await hardhat.upgrades.deployProxy(Minter, { initializer: 'initialize' });
    await m.deployed();

    // assert(await m.name() === '_Everywhere_TowerDefense_Minter1155_V1');

    console.log('Address m: ', m.address);
    console.log('Owner m: ', await m.owner());

    const owners = await hardhat.ethers.getSigners();

    const upgradeToAndCallTrx = await cm.connect(owners[0]).setFactory(m.address);
    await upgradeToAndCallTrx.wait();

    console.log('upgradeToAndCallTrx', upgradeToAndCallTrx);

    await sleep(4000);

    const check = await cm.connect(owners[0]).checkCollection('test collection');
    console.log('check', check);

    await sleep(4000);

    const resultsTrx = await cm.connect(owners[0]).create('test collection', 'tcxxxx');
    await resultsTrx.wait();
    console.log('resultsTrx', resultsTrx);
    
    const check1 = await cm.checkCollection('test collection');
    // await check1.wait();
    console.log('check1', check1);
});