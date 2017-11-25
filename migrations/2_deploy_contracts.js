let Token = artifacts.require("./QchainToken.sol");

module.exports = function(deployer, network, accounts) {
	console.log('network: ' + network);
	console.log('accounts: ' + accounts);
	const multisig = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
	const signer = '0x3a16f7fe44290f460ece714f078f0a0aecec1123';
    deployer.deploy(Token, signer, multisig);
};
