const { deployProxy } = require('@openzeppelin/truffle-upgrades');

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
    CM = artifacts.require('_Everywhere_TowerDefense_Collection_Minter1155_V1');
    // console.log(CM);

    Minter = artifacts.require('_Everywhere_TowerDefense_Minter1155_V1');
    // console.log(Minter);
});

it('should deploy', async () => {
    cm = await deployProxy(CM, {kind: 'uups'});

    assert(await cm.name() === '_Everywhere_TowerDefense_Collection_Minter1155_V1');

    const cmOwner = await cm.owner();

    console.log('Address cm: ', cm.address);
    console.log('Owner cm: ', cmOwner);

    m = await deployProxy(Minter, { initializer: 'initialize' });

    // assert(await m.name() === '_Everywhere_TowerDefense_Minter1155_V1');

    console.log('Address m: ', m.address);
    console.log('Owner m: ', await m.owner());

    const setFactoryTrx = await cm.setFactory(m.address, {from: cmOwner});

    console.log('setFactoryTrx', setFactoryTrx);

    await sleep(500);

    const check = await cm.checkCollection('test collection');
    console.log('check', check);

    await sleep(500);

    const resultsTrx = await cm.create('test collection', 'tcxxxx', {from: cmOwner});
    console.log('resultsTrx', resultsTrx);
    
    const check1 = await cm.checkCollection('test collection');
    // await check1.wait();
    console.log('check1', check1);
}).timeout(20000);