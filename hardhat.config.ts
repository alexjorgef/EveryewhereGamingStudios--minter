import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import '@nomiclabs/hardhat-etherscan'
import '@typechain/hardhat'
import 'solidity-coverage'
import 'hardhat-docgen'
import '@openzeppelin/hardhat-upgrades'
import '@hardhat-docgen/core'
import '@hardhat-docgen/markdown'
import 'hardhat-contract-sizer'

import { HardhatUserConfig, task } from 'hardhat/config'
import dotenv from 'dotenv'

import './tasks/collection'
import './tasks/marketplace'

dotenv.config()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    for (const account of accounts) {
        console.log(account.address)
    }
})

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    networks: {
        ethereum: {
            chainId: 1,
            url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ETHEREUM_ALCHEMY_API_KEY}`,
            accounts: process.env.WALLET_PRIVATE_KEY ? [`${process.env.WALLET_PRIVATE_KEY}`] : [],
        },
        goerli: {
            chainId: 420,
            url: `https://eth-goerli.alchemyapi.io/v2/${process.env.GOERLI_ALCHEMY_API_KEY}`,
            accounts: process.env.WALLET_PRIVATE_KEY ? [`${process.env.WALLET_PRIVATE_KEY}`] : [],
        },
        polygon: {
            chainId: 137,
            url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_API_KEY}`,
            accounts: process.env.WALLET_PRIVATE_KEY ? [`${process.env.WALLET_PRIVATE_KEY}`] : [],
            blockGasLimit: 100000000429720,
        },
        mumbai: {
            chainId: 80001,
            url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_API_KEY}`,
            accounts: process.env.WALLET_PRIVATE_KEY ? [`${process.env.WALLET_PRIVATE_KEY}`] : [],
            gas: 'auto',
            gasPrice: 8000000000,
        },
    },
    etherscan: {
        apiKey: {
            ropsten: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : '',
            polygon: process.env.POLYGONSCAN_API_KEY ? process.env.POLYGONSCAN_API_KEY : '',
            polygonMumbai: process.env.POLYGONSCAN_API_KEY ? process.env.POLYGONSCAN_API_KEY : '',
        },
    },
    solidity: {
        compilers: [
            {
                version: '0.8.17',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    typechain: {
        outDir: './build/typechain/',
        target: 'ethers-v5',
    },
    docgen: {
        path: './docs',
        clear: true,
        runOnCompile: false,
        except: ['/test/*', '/mock/*', '/hardhat-proxy/*'],
    },
    mocha: {
        timeout: 40000,
    },
}

export default config
