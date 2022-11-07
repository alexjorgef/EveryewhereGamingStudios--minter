import { task } from 'hardhat/config'
import BigNumber from 'bignumber.js'

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

task('collections:deploy', 'Deploy collections contracts').setAction(async (taskArgs, hre) => {
    // const [owner, addr1, addr2, ...addrs] = await hre.ethers.getSigners()
    const [owner] = await hre.ethers.getSigners()
    const Collection_Minter1155_V3 = await hre.ethers.getContractFactory('Collection_Minter1155_V3')
    const contractCollectionMinter = await Collection_Minter1155_V3.deploy()
    await contractCollectionMinter.deployed()

    const Minter1155_V3 = await hre.ethers.getContractFactory('Minter1155_V3')
    const contractMinter = await Minter1155_V3.deploy()
    await contractMinter.deployed()

    console.log('Deployer:', owner.address)
    console.log('Contract Collection_Minter1155_V3 deployed to:', contractCollectionMinter.address)
    console.log('Contract Minter1155_V3 deployed to:', contractMinter.address)
})
