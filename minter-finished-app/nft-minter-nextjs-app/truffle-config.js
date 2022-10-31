// truffle-config.js
// const { etherscanApiKey } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// @See: https://wiki.polygon.technology/docs/develop/truffle/
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
      cronos_testnet: {
        provider: () => new HDWalletProvider(
            process.env.PRIVATE_KEY, `https://evm-t3.cronos.org`
        ),
        network_id: "*",
        skipDryRun: true
      },
      matic_mumbai: {
        host: 'https://polygon-mumbai.g.alchemy.com/v2/SZi92VwllRwV6XL0Vz2zPHpo6xqgcJzh',
        network_id: "80001",
        skipDryRun: true
      },
      // @See: https://wiki.polygon.technology/docs/develop/truffle/
      // matic: {
      //   provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      //   network_id: 80001,
      //   confirmations: 2,
      //   timeoutBlocks: 200,
      //   skipDryRun: true
      // },
      development: {
        host: '127.0.0.1',
        port: 7545,
        network_id: "*",
        skipDryRun: true,
        // gas: 15000000 //https://ethereum.stackexchange.com/questions/65929/truffle-and-ganache-do-i-need-to-set-the-same-gas-price-and-gas-limit-in-both
      }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './build/contracts/',
  plugins: [
    'truffle-plugin-verify'
  ],
};