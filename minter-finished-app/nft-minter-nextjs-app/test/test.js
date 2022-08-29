require('dotenv').config();
const assert = require("chai").assert;
const fs = require('fs');

// const ContractTracker = require('../utils/ContractTracker');
// console.log('Contracts', ContractTracker.Contracts);

// @See: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
const truffleAssert = require('truffle-assertions');

/** @type {import('moralis').Moralis} */
const Moralis = require('moralis/node');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CM = artifacts.require('_Everywhere_TowerDefense_Collection_Minter1155_V1');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Minter = artifacts.require('_Everywhere_TowerDefense_Minter1155_V1');

contract('_Everywhere_TowerDefense_Collection_Minter1155_V1', (accounts) => {

    let cm, m, cmOwner, mOwner, testCollectionAddress, TestCollectionMinter;

    before(async () => {
        console.log('Starting Moralis');
        await Moralis.start({
            serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
            appId: process.env.NEXT_PUBLIC_APP_ID
        });
    });

    it('should be same as cache', async () => {
        console.log('Collection Minter address: ', CM.address);
        assert.notEqual(parseInt(CM.address, 16), 0);
    });

    it('should get deployed contract', async() => {
        cm = await CM.deployed();

        console.log('Collection Minter deployed address: ', cm.address);
        assert.notEqual(parseInt(cm.address, 16), 0);
        assert.equal(cm.address, CM.address);
    });

    it('should be same as cache', async () => {
        console.log('Minter address: ', Minter.address);
        assert.notEqual(parseInt(Minter.address, 16), 0);
    });

    it('should get deployed contract', async() => {
        m = await Minter.deployed();

        console.log('Minter deployed address: ', m.address);
        assert.notEqual(parseInt(m.address, 16), 0);
        assert.equal(m.address, Minter.address);
    });
    
    it('should not be zero', async () => {
        cmOwner = await cm.owner();
        console.log('Collection Minter Owner: ', cmOwner);
        assert.notEqual(parseInt(cmOwner, 16), 0);
    });

    it('should set the name of the Collection Minter Contract', async () => {
        const cSetName = await cm.setName('_Everywhere_TowerDefense_Collection_Minter1155_V1', { from: cmOwner });
        console.log('cSetName: ', cSetName);

        assert.equal(await cm.name(), '_Everywhere_TowerDefense_Collection_Minter1155_V1');
    });

    it('should not have a default name', async () => {
        assert.equal(await m.name(), '');
    });

    it('should be the same as Collection Minter Owner', async () => {
        mOwner = await m.owner()
        console.log('Minter Owner: ', mOwner);

        assert.notEqual(parseInt(mOwner, 16), 0);
        assert.equal(mOwner, cmOwner);
    });

    it('should get name and symbol set', async () => {
        const mSetData = await m.setData('_Everywhere__Test_Collection__', 'eTDtV1xxxx', { from: cmOwner });
        console.log('mSetData" ', mSetData);

        assert.equal(await m.name(), '_Everywhere__Test_Collection__');
        assert.equal(await m.symbol(),'eTDtV1xxxx');
    });

    it('Minter should get factory set: Address should be Minter address', async () => {
        const setFactoryTx = await cm.setFactory(m.address, { from: cmOwner });
        console.log('setFactoryTx: ', setFactoryTx);

        truffleAssert.eventEmitted(cm, 'FactoryContractUpdated', (ev) => {
            return parseInt(ev.address, 16) !== 0;
        });

        assert.equal(await cm.getFactoryAddress({ from: cmOwner }), m.address);
    });

    it('should not exist', async () => {
        const checkCollection = await cm.checkCollection('Test Collection');
        console.log('checkCollection: Test Collection ', checkCollection);

        assert.equal(parseInt(checkCollection, 16), 0);
    });

    it('should deploy a new contract: Address should not be zero', async () => {
        const createTx = await cm.create('Test Collection', 'eTDtV1', { from: cmOwner });
        console.log('createTx', createTx);
        
        truffleAssert.eventEmitted(cm, 'InstanceCreated', (ev) => {
            return parseInt(ev.address, 16) !== 0 && ev.name_ === 'Test Collection' && ev.symbol_ === 'eTDtV1';
        });

        assert.notEqual(parseInt(createTx.address, 16), 0);

        testCollectionAddress = createTx.address;
    });

    it('should have 1 Minter contract: Address should not be zero', async () => {
        const checkCollection = await cm.checkCollection('Test Collection');
        console.log('checkCollection', checkCollection);

        assert.notEqual(parseInt(checkCollection, 16), 0);
    });

    it('should +1 tx count', async () => {
        const checkCollection = await cm.checkCollection('Test Collection');
        console.log('checkCollection2', checkCollection);

        assert.notEqual(parseInt(checkCollection, 16), 0);
    });

    it('should +1 tx count', async () => {
        const checkCollection = await cm.checkCollection('Test Collection');
        console.log('checkCollection3', checkCollection);

        assert.notEqual(parseInt(checkCollection, 16), 0);
    });

    it('should +1 tx count and be zero', async () => {
        const checkCollection = await cm.checkCollection('Test Collection 1');
        console.log('checkCollection4', checkCollection);

        assert.equal(parseInt(checkCollection, 16), 0);
    });

    it('should find Test Collection Minter', async () => {
        TestCollectionMinter = await Minter.at(testCollectionAddress);
        console.log('TestCollectionMinter', TestCollectionMinter.address);

        assert.equal(TestCollectionMinter.address, testCollectionAddress);
    });

    it('should have correct name and symbol', async () => {
        assert.equal(await TestCollectionMinter.name(), 'Test Collection');
        assert.equal(await TestCollectionMinter.symbol(), 'eTDtV1');
    });

    it('should mint first mintable in Test Collection', async() => {
        const data = await fs.promises.readFile('./test/Frame9452.png');
        const fileToIpfs = new Moralis.File('TestCollectionMintable1', data);
        await fileToIpfs.saveIPFS();

        const fileToIpfsurl = fileToIpfs.ipfs();

        assert.notEqual(fileToIpfsurl, '');

        const metadata = {
            name: 'Pioneer Hero',
            description: 'Tsting!',
            properties: {
              Collection: await TestCollectionMinter.name(),
              TotalSupply: 1_000_000,
              tokenId: 0,
            },
            image: fileToIpfsurl,
        };

        assert.notEqual(metadata.Collection, '');

        const fileToUpload = new Moralis.File(`${collectionName}_Pioneer_Hero_Test_metadata.json`, {
            base64: Buffer.from(JSON.stringify(metadata)).toString('base64'),
        });

        await fileToUpload.saveIPFS();
        const metadataurl = fileToUpload.ipfs();

        assert.notEqual(metadataurl, '');
          
        const mintTx = await TestCollectionMinter.mint(metadataurl, 0, 1_000_000);
        console.log('mintTx', mintTx);
    }).timeout(20000);
});