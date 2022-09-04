require('dotenv').config();

const assert = require("chai").assert;
const Web3 = require('web3');
const web3 = new Web3('ws://localhost:7545');
const fs = require('fs');
const { Blob, Buffer } = require('node:buffer');

/** @type {import('moralis').Moralis} */
const MoralisCall = require('moralis/node');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CM = artifacts.require('Collection_Minter1155_V2');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Minter = artifacts.require('Minter1155_V2');

const testNewMinterAddress = '0x8ef9537581c70878f3e1946fAB3aFAc0DCf3f51e';

contract('Minter1155_V2', (accounts) => {
    let _accounts;

	before(async () => {
        console.log('Starting Moralis');
        await MoralisCall.start({
            serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
            appId: process.env.NEXT_PUBLIC_APP_ID,
            masterKey: process.env.NEXT_MASTER_KEY,
            moralisSecret: process.env.NEXT_SECRET_KEY
        });

        const network = await web3.eth.net.getNetworkType();
        console.log('network', network);

        _accounts = await web3.eth.getAccounts();
        console.table([{'_accounts': _accounts[0], 'accounts': accounts[0]}]);
    });

    it('should find Test Collection Minter', async () => {
        console.log('loading testNewMinterAddress at: ', testNewMinterAddress);

        testNewMinter = await Minter.at(testNewMinterAddress)
        // console.log( testNewMinter.abi);
        testNewMinter = new web3.eth.Contract(
            testNewMinter.abi,
            testNewMinterAddress
        );

        const owner = await testNewMinter.methods.owner().call();
        console.log('Owner', owner);

        console.log('testNewMinter.address', testNewMinter._address);

        assert.equal(testNewMinter._address, testNewMinterAddress);
    });

    // it('should setData', async() => {
    //     const setDataP = testNewMinter.methods.setData('Test Collection 2', 'eTDtV2');
    //     // console.log('setDataP', setDataP);

    //     // const gas = await setDataP.estimateGas();
    //     // console.log('gas', gas);

    //     const setDataTx = await setDataP.send({from: accounts[0], gas: 5000000});
    //     console.log('setDataTx', setDataTx);

    //     // assert.exists(setDataTx);
    // });

    it('should have correct name and symbol', async () => {
        const name = await testNewMinter.methods.name().call({from: accounts[0]});
        console.log('name', name);
        const symbol = await testNewMinter.methods.symbol().call({from: accounts[0]});
        console.log('symbol', symbol);

        assert.equal(name, 'Test Collection 2');
        assert.equal(symbol, 'eTDtV2');
    });

    it('should mint first mintable in Test Collection', async() => {
        const data = await fs.promises.readFile('test/Frame9452.png');
        console.log(data);
        const blob = new Blob([data], { type: 'image/png' });
        console.log(blob);

        const fileToIpfs = new MoralisCall.File('TestCollectionMintable1Image.png', blob);
        await fileToIpfs.saveIPFS({useMasterKey: true});

        const fileToIpfsurl = fileToIpfs.ipfs();

        assert.notEqual(fileToIpfsurl, '');

        const metadata = {
            name: 'Pioneer Hero',
            description: 'Tsting!',
            properties: {
              Collection: await testNewMinter.methods.name().call({from: accounts[0]}),
              tokenId: 0,
            },
            image: fileToIpfsurl,
        };

        assert.notEqual(metadata.Collection, '');

        const fileToUpload = new MoralisCall.File(`Pioneer_Hero_Test_Ganache_metadata.json`, {
            base64: Buffer.from(JSON.stringify(metadata)).toString('base64'),
        });

        await fileToUpload.saveIPFS({useMasterKey: true});
        const metadataurl = fileToUpload.ipfs();

        assert.notEqual(metadataurl, '');

        console.log('metadataurl', metadataurl);
        
        const mintTx = await testNewMinter.methods.mint(metadataurl, 0, 1_000_000).send({from: accounts[0], gas: 500000});
        console.log('mintTx', mintTx);
    }).timeout(20000);
});