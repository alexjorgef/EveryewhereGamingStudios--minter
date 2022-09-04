require('dotenv').config();
const assert = require("chai").assert;

const TruffleConfigs = require('../truffle-config');

const Artifactor = require("@truffle/artifactor");
const artifactor = new Artifactor(TruffleConfigs.contracts_build_directory);

// const Web3 = require('web3');
// const web3 = new Web3('ws://localhost:7545');

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

// @See: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
// const truffleAssert = require('truffle-assertions');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CM = artifacts.require('Collection_Minter1155_V2');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Minter = artifacts.require('Minter1155_V2');

contract('Minter1155_V2', (accounts) => {
    let cm, m, cmOwner, mOwner, testNewMinterInstanceCreatedTx;

    const ContractName = 'Test Collection 2';
    const ContractSymbol = 'eTDtV2';

    it('should get deployed Collection Minter contract', async() => {
        cm = await CM.deployed();

        console.log('Collection Minter deployed address: ', cm.address);
        assert.notEqual(parseInt(cm.address, 16), 0);
        assert.equal(cm.address, CM.address);
    });

    it('should get deployed Minter contract', async() => {
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

    it('should be the same as Collection Minter Owner', async () => {
        mOwner = await m.owner();
        console.log('Minter Owner: ', mOwner);

        assert.notEqual(parseInt(mOwner, 16), 0);
        assert.equal(mOwner, cmOwner);
    });

    it('should be same owner', () => {
        console.log(cmOwner, accounts[0]);
        assert.equal(cmOwner, accounts[0]);
    });

    it('should deploy a new contract: Address should not be zero', async () => {

        console.log("Calling createMinter from: ", cmOwner);

        const createTx = await cm.createMinter(ContractName, ContractSymbol, { from: cmOwner });
        console.log('createTx', createTx);
        
        // truffleAssert.eventEmitted(createTx, 'InstanceCreated', (ev) => {
        //     console.log('Event InstanceCreated: ', ev);
        //     return parseInt(ev.address_, 16) !== 0 && ev.name_ === 'Test Collection' && ev.symbol_ === 'eTDtV2';
        // });

        // truffleAssert.eventEmitted(createTx, 'InstanceCreatedStart', (ev) => {
        //     console.log('Event InstanceCreatedStart: ', ev);
        //     return parseInt(ev.caller, 16) !== 0 && parseInt(ev.owner, 16) !== 0 && ev.name_ === 'Test Collection' && ev.symbol_ === 'eTDtV1';
        // });

        testNewMinterInstanceCreatedTx = createTx.logs.find( log => log.event === 'InstanceCreated');

        const testNewMinterAddressArgs = createTx.logs.find( log => log.event === 'InstanceCreated').args;

        console.log('testNewMinterAddressArgs', testNewMinterAddressArgs);

        testNewMinterAddress = testNewMinterAddressArgs.instanceAddress;

        console.log('testNewMinterAddress:', testNewMinterAddress);
        assert.notEqual(parseInt(testNewMinterAddress, 16), 0);
    });

    it('should have 1 Minter contract: Address should not be zero', async () => {
        const checkCollection = await cm.checkCollection(ContractName);
        console.log('checkCollection:', checkCollection);

        assert.notEqual(parseInt(checkCollection, 16), 0);
    });

    it('should find new Minter', async () => {
        console.log('loading testNewMinterAddress at: ', testNewMinterAddress);

        testNewMinter = await Minter.at(testNewMinterAddress);

        console.table([{'testNewMinter': testNewMinter.address, 'm': m.address}]);

        assert.notEqual(testNewMinter.address, m.address);
    });

    it('should save new artifact', async() => {
        // const testNewMinterWeb3 = new web3.eth.Contract(
        //     testNewMinter.abi,
        //     testNewMinterAddress
        // );

        // testNewMinterWeb3.contractName = ContractName.replace(' ', '_');
        // testNewMinterWeb3.networks = {};
        // testNewMinterWeb3.networks[5777] = {
        //     address: testNewMinterAddress,
        //     transactionHash: testNewMinterInstanceCreatedTx.transactionHash
        // };

        // console.log('testNewMinterWeb3', testNewMinterWeb3);

        testNewMinter.contractName = ContractName.replace(' ', '_');
        testNewMinter.networks ??= {};
        testNewMinter.networks[5777] = {
            address: testNewMinterAddress,
            transactionHash: testNewMinterInstanceCreatedTx.transactionHash
        };

        await artifactor.save(testNewMinter);
    });

    it('should list all collections', async () => {
        console.log('loading testNewMinterAddress at: ', testNewMinterAddress);

        const collections = await cm.getCollectons();
        console.log('collections', collections);

        assert.notEqual(collections.length, 0);
    });
});