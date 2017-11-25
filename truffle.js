let configs = require("./config.js");
let ethwallet = require('ethereumjs-wallet');
let ProviderEngine = require("web3-provider-engine");
let WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
let NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
let Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
let Web3 = require("web3");

function getEngine(providerUrl, privateKey) {
  let prKey = new Buffer(privateKey, 'hex');
  let wallet = ethwallet.fromPrivateKey(prKey);
  let address = "0x" + wallet.getAddress().toString("hex");

  let engine = new ProviderEngine();
  engine.addProvider(new WalletSubprovider(wallet, {}));
  engine.addProvider(new NonceSubprovider());
  engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));

  return [address, engine];
}

let [mainnetAddress, mainnetEngine] = getEngine(configs.urlMainnet, configs.privateKeyMainnet);
let [kovanAddress, kovanEngine] = getEngine(configs.urlKovan, configs.privateKeyKovan);


module.exports = {
  networks: {
    development: {
      network_id: "*", // Match any network id
      host: "localhost",
      port: 8545,
    },
    kovan : {
      network_id: "*", // Match any network id,
      gasPrice: 10000000000,  // 10 Gwei
      provider: kovanEngine,
      from: kovanAddress
    },
    mainnet: {
      network_id: 1,
      gasPrice: 20000000000,  // 20 Gwei
      provider: mainnetEngine,
      from: mainnetAddress
    }
  }
};
