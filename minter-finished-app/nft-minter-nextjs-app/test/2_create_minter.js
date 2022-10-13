require('dotenv').config();
const assert = require("chai").assert;
const fs = require('fs');

const TruffleConfigs = require('../truffle-config');

const Artifactor = require("@truffle/artifactor");
const artifactor = new Artifactor(TruffleConfigs.contracts_build_directory);

// const Web3 = require('web3');
// const web3 = new Web3('ws://localhost:7545');

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

// @See: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
const truffleAssert = require('truffle-assertions');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CollectionMinterArtifact = artifacts.require('Collection_Minter1155_V3');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const MinterArtifact = artifacts.require('Minter1155_V3');

contract('Minter1155_V3', (accounts) => {
    /** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractInstance} */
    let CollectionMinter;
    
    let Minter, MinterInstanceCreatedTx, MinterAddress, NewMinter;

    const ContractName = 'Cosmic Exodus: Withstand Kiaros - Base Set 3';
    const ContractSymbol = 'CEWKBS3';

    it('should get deployed Collection Minter contract', async() => {
        CollectionMinter = await CollectionMinterArtifact.deployed();

        console.log('Collection Minter deployed address: ', CollectionMinter.address);
        assert.notEqual(parseInt(CollectionMinter.address, 16), 0);
        assert.equal(CollectionMinter.address, CollectionMinterArtifact.address);
    });

    it('should get deployed Minter contract', async() => {
        Minter = await MinterArtifact.deployed();

        console.log('Minter deployed address: ', Minter.address);
        assert.notEqual(parseInt(Minter.address, 16), 0);
        assert.equal(Minter.address, MinterArtifact.address);
    });

    it('should deploy a new contract: Address should not be zero', async () => {

        console.log("Calling createMinter from: ", accounts[0]);

        const createTx = await CollectionMinter.createMinter(ContractName, ContractSymbol, { from: accounts[0] });
        console.log('createTx', createTx);

        truffleAssert.eventEmitted(createTx, 'InstanceCreated', (ev) => {
            console.log('Event InstanceCreated: ', ev);
            return parseInt(ev.address_, 16) !== 0 && ev.name_ === ContractName && ev.symbol_ === ContractSymbol;
        });

        truffleAssert.eventEmitted(createTx, 'InstanceCreatedStart', (ev) => {
            console.log('Event InstanceCreatedStart: ', ev);
            return parseInt(ev.caller, 16) !== 0 && parseInt(ev.owner, 16) !== 0 && ev.name_ === ContractName && ev.symbol_ === ContractSymbol;
        });

        MinterInstanceCreatedTx = createTx.logs.find( log => log.event === 'InstanceCreated');

        const testNewMinterAddressArgs = createTx.logs.find( log => log.event === 'InstanceCreated').args;
        console.log('testNewMinterAddressArgs', testNewMinterAddressArgs);
        
        MinterAddress = testNewMinterAddressArgs.instanceAddress;
        console.log('testNewMinterAddress:', MinterAddress);
        assert.notEqual(parseInt(MinterAddress, 16), 0);

        const events = await CollectionMinter.getPastEvents('allEvents', {fromBlock:0});
        console.log('allEvents', events);

        const MinterEvents = events.filter(event => event.address === MinterAddress);
        console.log('MinterEvents', MinterEvents);        
    });

    it('should find new Minter', async () => {
        console.log('loading testNewMinterAddress at: ', MinterAddress);

        NewMinter = await MinterArtifact.at(MinterAddress);

        console.table([{'NewMinter': NewMinter.address, 'Minter': Minter.address}]);

        assert.notEqual(NewMinter.address, Minter.address);
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

        // console.log('testNewMinter', testNewMinter.contractName, testNewMinter.address, testNewMinter.networks);

        MinterArtifact.contractName = ContractName;//.replace(/ /g, '_');
        delete MinterArtifact.networks[5777]['events'];
        MinterArtifact.networks[5777]['address'] = MinterAddress;
        MinterArtifact.networks[5777]['transactionHash'] = MinterInstanceCreatedTx.transactionHash;

        await artifactor.save(MinterArtifact);
    
        fs.promises.writeFile('./test/MinterAddress.json', JSON.stringify({
            name: ContractName,
            symbol: ContractSymbol,
            address: MinterAddress
        }), {flag: 'w'});
    });

    it('should list all collections', async () => {
        console.log('loading testNewMinterAddress at: ', MinterAddress);

        const collections = await CollectionMinter.getCollectons();
        console.log('collections', collections);
        console.log('collectionsFiltered', collections[0].map( (BN) => {
            return BN.toFixed(0);
        }));

        assert.notEqual(collections.length, 0);
    });
});