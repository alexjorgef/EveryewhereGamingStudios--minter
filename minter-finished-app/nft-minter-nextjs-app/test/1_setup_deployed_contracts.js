require('dotenv').config();
const assert = require("chai").assert;

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

// @See: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
const truffleAssert = require('truffle-assertions');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CollectionMinterArtifact = artifacts.require('Collection_Minter1155_V3');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const MinterArtifcat = artifacts.require('Minter1155_V3');

contract('Collection_Minter1155_V3', (accounts) => {

    let CollectionMinter, Minter, CollectionMinterOwner, MinterOwner;

    it('should be same as Collection Minter deployed address: not zero', async () => {
        console.log('Collection Minter address: ', CollectionMinterArtifact.address);
        assert.notEqual(parseInt(CollectionMinterArtifact.address, 16), 0);
    });

    it('should get deployed Collection Minter contract', async() => {
        CollectionMinter = await CollectionMinterArtifact.deployed();

        console.log('Collection Minter deployed address: ', CollectionMinter.address);
        assert.notEqual(parseInt(CollectionMinter.address, 16), 0);
        assert.equal(CollectionMinter.address, CollectionMinterArtifact.address);
    });

    it('should be same as Minter deployed address: not zero', async () => {
        await sleep(100);
        console.log('Minter address: ', MinterArtifcat.address);
        assert.notEqual(parseInt(MinterArtifcat.address, 16), 0);
    });

    it('should get deployed Minter contract', async() => {
        Minter = await MinterArtifcat.deployed();

        console.log('Minter deployed address: ', Minter.address);
        assert.notEqual(parseInt(Minter.address, 16), 0);
        assert.equal(Minter.address, Minter.address);
    });
    
    it('should not be zero Collection Minter owner', async () => {
        CollectionMinterOwner = await CollectionMinter.owner();
        console.log('Collection Minter Owner: ', CollectionMinterOwner);
        assert.notEqual(parseInt(CollectionMinterOwner, 16), 0);
    });

    it('should be the same as Collection Minter Owner', async () => {
        MinterOwner = await Minter.owner()
        console.log('Minter Owner: ', MinterOwner);

        assert.notEqual(parseInt(MinterOwner, 16), 0);
        assert.equal(MinterOwner, CollectionMinterOwner);
    });

    it('should set the name of the Collection Minter Contract', async () => {
        const cSetName = await CollectionMinter.setName('Cosmic Exodus Collection Factory', { from: CollectionMinterOwner });
        console.log('cSetName: ', cSetName);

        assert.equal(await CollectionMinter.name(), 'Cosmic Exodus Collection Factory');
    });

    it('should not have a default Minter name of ""', async () => {
        assert.equal(await Minter.name(), '');
    });

    it('should set name and symbol set', async () => {
        const mSetData = await Minter.setData('Cosmic Exodus Collection Minter', 'CECM', { from: CollectionMinterOwner });
        console.log('mSetData" ', mSetData);

        assert.equal(await Minter.name(), 'Cosmic Exodus Collection Minter');
        assert.equal(await Minter.symbol(), 'CECM');
    });

    it('Minter should set factory: Address should be Minter address', async () => {
        const setFactoryTx = await CollectionMinter.setFactory(Minter.address, { from: CollectionMinterOwner });
        console.log('setFactoryTx: ', setFactoryTx);

        truffleAssert.eventEmitted(setFactoryTx, 'FactoryContractUpdated', (ev) => {
            return parseInt(ev.address_, 16) !== 0;
        });

        const factoryAddress = await CollectionMinter.getFactoryAddress({ from: CollectionMinterOwner });
        console.log('factoryAddress', factoryAddress, Minter.address);

        assert.equal(factoryAddress, Minter.address);
    });

    it('should not exist', async () => {
        const checkCollection = await CollectionMinter.checkCollectionByName('Test Collection');
        console.log('checkCollection: Test Collection ', checkCollection);

        assert.equal(checkCollection, false);
    });
});