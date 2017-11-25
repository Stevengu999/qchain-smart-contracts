<img width="360" alt="Qchain" src="./assets/logo.png">

# Qchain Smart Contracts
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![yarn](https://img.shields.io/badge/yarn-v1.2.1-yellow.svg)](https://yarnpkg.com/lang/en/docs/install/)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/nodejs/node)
[![truffle](https://img.shields.io/badge/truffle-v3.4.11-orange.svg)](https://truffle.readthedocs.io/en/latest/)
[![testrpc](https://img.shields.io/badge/testrpc-v4.0.1-yellowgreen.svg)](https://github.com/ethereumjs/testrpc)
[![solidity](https://img.shields.io/badge/solidity-docs-red.svg)](http://solidity.readthedocs.io/en/develop/types.html)

## Project description
Qchain is a blockchain-powered marketing and advertising platform.
This repository has a set of smart contracts for the Qchain ERC-20 token on Ethereum blockchain.

## Dependencies
We use [Truffle](http://truffleframework.com/) to compile, test and deploy smart contracts.

You will also need a running node with an active JSON-RPC (required). For testing purposes, we suggest using [TestRPC](https://github.com/ethereumjs/testrpc).
We strongly recommend you to use latest **node**, **npm**, and **yarn** versions.<br />

The environment can be set up by the command:
`yarn install`

For more information about Truffle visit [https://truffle.readthedocs.io/en/latest/](https://truffle.readthedocs.io/en/latest/).

## Usage
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
2. `yarn install` - installs all npm packages.
3. Run `mv config.example.js config.js` and set all required parameters.
4. `yarn test` - runs tests
5. `./serve/generate_single_contract.py <CONTRACT_PATH>` - generates file `build/contract.sol` that contains all dependent contracts code. Useful for verification on [Etherscan.io](https://etherscan.io/), for instance.

## Contracts on Etherscan
Token address: [0xc438b4c0dfbb1593be6dee03bbd1a84bb3aa6213](https://etherscan.io/token/0xc438b4c0dfbb1593be6dee03bbd1a84bb3aa6213#readContract)

## Authors
<a href="https://zerion.io?utm_source=qchain_contracts"><img width="360" alt="Powered by Zerion" src="./assets/zerion.png"></a>
