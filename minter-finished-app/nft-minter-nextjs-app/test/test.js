const assert = require("chai").assert;

// @See: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
const truffleAssert = require('truffle-assertions');

/** @type {ContractInstance} */
const CM = artifacts.require('_Everywhere_TowerDefense_Collection_Minter1155_V1');

/** @type {ContractInstance} */
const Minter = artifacts.require('_Everywhere_TowerDefense_Minter1155_V1');

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

contract('_Everywhere_TowerDefense_Collection_Minter1155_V1', (accounts) => {

    let cm, m, cmOwner, mOwner;

    it('Collection Minter should be deployed: Address should not be zero', async () => {
        //cm = await deployProxy(CM, {kind: 'uups', initializer: 'initialize'});
        cm = await CM.deployed();
        console.log('ACollection Minter ddress: ', cm.address);
        assert.exists(cm);
        assert.notEqual(parseInt(cm.address, 16), 0);
    });

    it('Owner should not be zero', async () => {
        cmOwner = await cm.owner();
        console.log('Collection Minter Owner: ', cmOwner);
        assert.notEqual(parseInt(cm.address, 16), 0);
    });

    it('should set the name of the Collection Minter Contract', async () => {
        // const cminit = await cm.initialize({from: cmOwner});
        // console.log('cminit: ', cminit);

        const cSetName = await cm.setName('_Everywhere_TowerDefense_Collection_Minter1155_V1', { from: cmOwner });
        console.log('cSetName: ', cSetName);

        assert.equal(await cm.name(), '_Everywhere_TowerDefense_Collection_Minter1155_V1');

    });

    it('Minter should be deployed: Address should not be zero', async () => {
        //m = await deployProxy(Minter, { initializer: 'initialize' });
        m = await Minter.deployed();
        console.log('Minter Address: ', m.address);

        assert.exists(m);
        assert.notEqual(parseInt(m.address, 16), 0);
    });

    it('Deployed Minter should not have a default name', async () => {
        // const cinit = await m.initialize({from: cmOwner});
        // console.log('cinit: ', cinit);

        assert.equal(await m.name(), '');
    });

    it('Minter Owner should be the same as Collection Minter Owner', async () => {
        mOwner = await m.owner()
        console.log('Minter Owner: ', mOwner);;

        assert.equal(mOwner, cmOwner);
    });

    it('Minter should get name and symbol set', async () => {
        const mSetData = await m.setData('_Everywhere__Test_Collection__', 'eTDtV1xxxx', { from: cmOwner });
        console.log('mSetData" ', mSetData);

        assert.equal(await m.name(), '_Everywhere__Test_Collection__');
        assert.equal(await m.symbol(),'eTDtV1xxxx');
    });

    it('Collection Minter should get factory set: Address should be Minter address', async () => {
        const setFactoryTx = await cm.setFactory(m.address, { from: cmOwner });
        console.log('setFactoryTx: ', setFactoryTx);

        truffleAssert.eventEmitted(setFactoryTx, 'FactoryContractUpdated', (ev) => {
            return parseInt(ev.address, 16) !== 0;
        });

        assert.equal(await cm.getFactoryAddress({ from: cmOwner }), m.address);
    });

    it('Test Collection should not exist', async () => {
        const check = await cm.checkCollection('Test Collection');
        console.log('checkCollection: Test Collection ', check);

        assert.equal(parseInt(check, 16), 0);
    });

    it('Collection Manager should deploy a new contract: Address should not be zero', async () => {
        const createTx = await cm.create('Test Collection', 'eTDtV1', { from: cmOwner });
        console.log('createTx', createTx);
        
        truffleAssert.eventEmitted(createTx, 'InstanceCreated', (ev) => {
            return parseInt(ev.address, 16) !== 0 && ev.name_ === 'Test Collection' && ev.symbol_ === 'eTDtV1';
        });

        assert.notEqual(parseInt(createTx, 16), 0);
    });

    it('Collection Minter Should have 1 Minter contract: Address should not be zero', async () => {
        const check1 = await cm.checkCollection('Test Collection');
        console.log('check1', check1);

        assert.notEqual(parseInt(check1, 16), 0);
    });
});