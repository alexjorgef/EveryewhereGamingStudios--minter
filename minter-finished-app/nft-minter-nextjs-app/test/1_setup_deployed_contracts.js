require('dotenv').config();
const assert = require("chai").assert;

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

// @See: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
const truffleAssert = require('truffle-assertions');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CM = artifacts.require('Collection_Minter1155_V2');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Minter = artifacts.require('Minter1155_V2');

contract('Collection_Minter1155_V2', (accounts) => {

    /** @type {import('@openzeppelin/truffle-upgrades/dist/utils/truffle').TruffleContract} */
    
    let cm, m, cmOwner, mOwner;

    it('should be same as Collection Minter deployed address: not zero', async () => {
        console.log('Collection Minter address: ', CM.address);
        assert.notEqual(parseInt(CM.address, 16), 0);
    });

    it('should get deployed Collection Minter contract', async() => {
        cm = await CM.deployed();

        console.log('Collection Minter deployed address: ', cm.address);
        assert.notEqual(parseInt(cm.address, 16), 0);
        assert.equal(cm.address, CM.address);
    });

    it('should be same as Minter deployed address: not zero', async () => {
        console.log('Minter address: ', Minter.address);
        assert.notEqual(parseInt(Minter.address, 16), 0);
    });

    it('should get deployed Minter contract', async() => {
        m = await Minter.deployed();

        console.log('Minter deployed address: ', m.address);
        assert.notEqual(parseInt(m.address, 16), 0);
        assert.equal(m.address, Minter.address);
    });
    
    it('should not be zero Collection Minter owner', async () => {
        cmOwner = await cm.owner();
        console.log('Collection Minter Owner: ', cmOwner);
        assert.notEqual(parseInt(cmOwner, 16), 0);
    });

    it('should be the same as Collection Minter Owner', async () => {
        mOwner = await m.owner()
        console.log('Minter Owner: ', mOwner);

        assert.notEqual(parseInt(mOwner, 16), 0);
        assert.equal(mOwner, cmOwner);
    });

    it('should set the name of the Collection Minter Contract', async () => {
        const cSetName = await cm.setName('Collection_Minter1155_V2', { from: cmOwner });
        console.log('cSetName: ', cSetName);

        assert.equal(await cm.name(), 'Collection_Minter1155_V2');
    });

    it('should not have a default Minter name of ""', async () => {
        assert.equal(await m.name(), '');
    });

    it('should set name and symbol set', async () => {
        const mSetData = await m.setData('_Everywhere__Test_Collection__', 'eTDtV1xxxx', { from: cmOwner });
        console.log('mSetData" ', mSetData);

        assert.equal(await m.name(), '_Everywhere__Test_Collection__');
        assert.equal(await m.symbol(),'eTDtV1xxxx');
    });

    it('Minter should set factory: Address should be Minter address', async () => {
        const setFactoryTx = await cm.setFactory(m.address, { from: cmOwner });
        console.log('setFactoryTx: ', setFactoryTx);

        truffleAssert.eventEmitted(setFactoryTx, 'FactoryContractUpdated', (ev) => {
            return parseInt(ev.address_, 16) !== 0;
        });

        const factoryAddress = await cm.getFactoryAddress({ from: cmOwner });
        console.log('factoryAddress', factoryAddress, m.address);

        assert.equal(factoryAddress, m.address);
    });

    it('should not exist', async () => {
        const checkCollection = await cm.checkCollection('Test Collection');
        console.log('checkCollection: Test Collection ', checkCollection);

        assert.equal(parseInt(checkCollection, 16), 0);
    });
});