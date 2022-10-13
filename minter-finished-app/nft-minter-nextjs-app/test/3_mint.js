require('dotenv').config();

const assert = require("chai").assert;
// const Web3 = require('web3');
// const web3 = new Web3('ws://127.0.0.1:7545');
const fs = require('fs');
const { Blob, Buffer } = require('node:buffer');

/** @type {import('moralis').Moralis} */
const MoralisCall = require('moralis/node');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const CollectionMinterArtifact = artifacts.require('Collection_Minter1155_V3');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Minter = artifacts.require('Minter1155_V3');

contract('Minter1155_V3', (accounts) => {
    
    const NewMinterConfigs = require('./MinterAddress.json');

    let NewMinter;

	before(async () => {
        console.log('Starting Moralis');
        await MoralisCall.start({
            serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
            appId: process.env.NEXT_PUBLIC_APP_ID,
            masterKey: process.env.NEXT_MASTER_KEY,
            //moralisSecret: process.env.NEXT_SECRET_KEY
        });

        // const network = await web3.eth.net.getNetworkType();
        // console.log('network', network);

        // _accounts = await web3.eth.getAccounts();
        // console.table([{'_accounts': _accounts[0], 'accounts': accounts[0]}]);

        console.log('NewMinterConfigs: ', NewMinterConfigs);
        assert(NewMinterConfigs && NewMinterConfigs.address && NewMinterConfigs.address.length);
        assert(parseInt(NewMinterConfigs.address, 16) !== 0);

        assert(NewMinterConfigs && NewMinterConfigs.name && NewMinterConfigs.name.length);
        assert(NewMinterConfigs && NewMinterConfigs.symbol && NewMinterConfigs.symbol.length);
    });

    it('should find Minter', async () => {
        console.log('loading NewMinterConfigs.address at: ', NewMinterConfigs.address);

        NewMinter = await Minter.at(NewMinterConfigs.address);
        console.log('NewMinter.address', NewMinter.address);
        assert.equal(NewMinter.address, NewMinterConfigs.address);
    });

    it('should have correct name and symbol', async () => {
        const name = await NewMinter.name({from: accounts[0]});
        console.log('name', name);
        const symbol = await NewMinter.symbol({from: accounts[0]});
        console.log('symbol', symbol);

        assert.equal(name, NewMinterConfigs.name);
        assert.equal(symbol, NewMinterConfigs.symbol);
    });

    it('should mint first mintable in Test Collection', async() => {
        const data = await fs.promises.readFile('./test/Frame9452.png');
        console.log(data);
        const blob = new Blob([data], { type: 'image/png' });
        console.log(blob);

        const fileToIpfs = new MoralisCall.File('TestCollectionMintable7Image.png', blob);
        await fileToIpfs.saveIPFS({useMasterKey: true});

        const fileToIpfsurl = fileToIpfs.ipfs();

        assert.notEqual(fileToIpfsurl, '');

        const metadata = {
            name: 'Pioneer Hero',
            description: 'Testing!',
            properties: {
              Collection: await NewMinter.name({from: accounts[0]}),
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
        
        const mintTx = await NewMinter.mint(metadataurl, 0, 1_000_000, {from: accounts[0]});
        console.log('mintTx', mintTx);

        console.log('mintTx Minted Ev', mintTx.events.find( ev => ev.event === 'Minted'));
    }).timeout(20000);

    it('should list 1 mintable', async() => {
        const totalSupply = NewMinter.totalSupply(0);
        console.log('totalSupply', totalSupply);

        assert.notEqual(totalSupply, 0);
    });
});