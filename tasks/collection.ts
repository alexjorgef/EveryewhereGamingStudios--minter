import { task } from 'hardhat/config'
// import BigNumber from 'bignumber.js'

import dataCollections from '../data/CosmicNFTsMetadata.json'

// interface INetwork {
//     testA: string
//     testB: number
// }

// const networks: { [id: string]: INetwork } = {
//     polygon: {
//         testA: '0x000000000000000000000000000000x',
//         testB: 50,
//     },
//     mumbai: {
//         testA: '0x000000000000000000000000000000x',
//         testB: 13,
//     },
// }

task('collection:deploy', 'Deploy Collection contract').setAction(async (taskArgs, hre) => {
    // const [owner, addr1, addr2, ...addrs] = await hre.ethers.getSigners()
    const [owner] = await hre.ethers.getSigners()
    const contractName = 'CosmicNFT'
    const Contract = await hre.ethers.getContractFactory(contractName)
    const contract = await Contract.deploy('Cosmic NFTs', 'COSMICNFT')
    await contract.deployed()
    console.log(`Contract ${contractName} deployed to ${contract.address} by ${owner.address}`)
})

task('collection:mint-all', 'Mint all collections')
    .addParam('contract', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract
        const contractDeployed = await hre.ethers.getContractAt('CosmicNFT', contractAddress)
        for (const collection of dataCollections) {
            const tx = await contractDeployed.mintWithstandKairosNFT(
                collection['metadataUri'],
                collection['class'],
                collection['rarity']
            )
            console.log(`Minted ${collection['class']}:${collection['rarity']} in ${contractAddress}: ${tx.hash}`)
        }
    })

task('collection:approve-all', 'Approve all collections')
    .addParam('contract', 'Collection contract address')
    .addParam('marketplace', 'Marketplace contract address')
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract
        const marketplaceAddress = taskArgs.marketplace
        const contractDeployed = await hre.ethers.getContractAt('CosmicNFT', contractAddress)
        for (const [i] of dataCollections.entries()) {
            // TODO: approve only if not already approved
            const txApprove = await contractDeployed.approve(marketplaceAddress, i)
            console.log(`Approve collection ${i}: ${txApprove.hash}`)
        }
    })
