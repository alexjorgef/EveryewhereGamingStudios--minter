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
    //cm = await deployProxy(CM, {kind: 'uups', initializer: 'initialize'});
    cm = await CM.deployed();
    console.log('Address cm: ', cm.address);

    const cmOwner = await cm.owner();
    console.log('Owner cm: ', cmOwner);

    // const cminit = await cm.initialize({from: cmOwner});
    // console.log('cminit: ', cminit);

    const cSetName = await cm.setName('_Everywhere_TowerDefense_Collection_Minter1155_V1', {from: cmOwner});
    console.log('cSetName: ', cSetName);

    assert(await cm.name() === '_Everywhere_TowerDefense_Collection_Minter1155_V1');

    //m = await deployProxy(Minter, { initializer: 'initialize' });
    m = await Minter.deployed();
    console.log('Address m: ', m.address);

    const mOwner = await m.owner()
    console.log('Owner m: ', mOwner);;

    assert(mOwner === cmOwner);

    // const cinit = await m.initialize({from: cmOwner});
    // console.log('cinit: ', cinit);

    assert(await m.name() === '');

    const mSetData = await m.setData('_Everywhere__Test_Collection__', 'eTDtV1xxxx', {from: cmOwner});
    console.log('mSetData', mSetData);

    assert(await m.name() === '_Everywhere__Test_Collection__');
    assert(await m.symbol() === 'eTDtV1xxxx');
   
    const setFactoryTrx = await cm.setFactory(m.address, {from: cmOwner});
    console.log('setFactoryTrx', setFactoryTrx);

    const check = await cm.checkCollection('Test Collection');
    console.log('check', check);
    
    assert(parseInt(check, 16) === 0);

    const resultsTrx = await cm.create('Test Collection', 'eTDtV1', {from: cmOwner});
    console.log('resultsTrx', resultsTrx);

    assert(parseInt(resultsTrx, 16) !== 0);
    
    const check1 = await cm.checkCollection('Test Collection');
    console.log('check1', check1);

    assert(parseInt(check1, 16) !== 0);
}).timeout(20000);