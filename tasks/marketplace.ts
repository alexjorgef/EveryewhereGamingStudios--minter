import { task } from 'hardhat/config'
// import BigNumber from 'bignumber.js'

import dataCollections from '../data/CosmicNFTsMetadata.json'

interface INetwork {
    testA: string
    testB: number
}

const networks: { [id: string]: INetwork } = {
    polygon: {
        testA: '0x000000000000000000000000000000x',
        testB: 50,
    },
    mumbai: {
        testA: '0x000000000000000000000000000000x',
        testB: 13,
    },
}

task('marketplace:deploy', 'Deploy Marketplace contract').setAction(async (taskArgs, hre) => {
    const [owner, addr1, addr2, ...addrs] = await hre.ethers.getSigners()
    const Contract = await hre.ethers.getContractFactory('Marketplace')
    const contract = await Contract.deploy(1, owner.address)
    await contract.deployed()
    console.log(`Contract deployed to ${contract.address} by ${owner.address}`)
})

task('marketplace:whitelist-collection-add', 'Whitelist a collection contract')
    .addParam('contract', 'Marketplace contract address')
    .addParam('collection', 'Collection Contract address to whitelist')
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract
        const collectionAddress = taskArgs.collection
        const contractDeployed = await hre.ethers.getContractAt('Marketplace', contractAddress)
        const tx = await contractDeployed.whitelistNftCollection(collectionAddress)
        console.log(`Collection ${collectionAddress} whitelisted in ${contractAddress}: ${tx.hash}`)
    })

task('marketplace:whitelist-collection-remove', 'Remove a collection contract from whitelist')
    .addParam('contract', 'Marketplace contract address')
    .addParam('collection', 'Collection Contract idx to remove from whitelist')
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract
        const collectionIdx = taskArgs.collection
        const contractDeployed = await hre.ethers.getContractAt('Marketplace', contractAddress)
        const tx = await contractDeployed.removeWhitelistedAddress(collectionIdx)
        console.log(`Collection ${collectionIdx} removed from whitelist in ${contractAddress}: ${tx.hash}`)
    })

task('marketplace:make-all', 'Make all collections available for sale')
    .addParam('contract', 'Marketplace contract address')
    .addParam('collection', 'Collection Contract address to whitelist')
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract
        const collectionAddress = taskArgs.collection
        const contractDeployed = await hre.ethers.getContractAt('Marketplace', contractAddress)
        for (const [i, collection] of dataCollections.entries()) {
            const tx = await contractDeployed.makeItem(
                collectionAddress,
                i,
                hre.ethers.BigNumber.from(collection['rarity'] + 1).mul(
                    hre.ethers.BigNumber.from(10).pow(hre.ethers.BigNumber.from(18))
                ),
                hre.ethers.BigNumber.from(2 * (collection['rarity'] + 1)).mul(
                    hre.ethers.BigNumber.from(10).pow(hre.ethers.BigNumber.from(18))
                ),
                Math.floor(Math.random() * 3) + 1
            )
            console.log(`Make collection ${i} available: ${tx.hash}`)
        }
    })
