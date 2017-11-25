let Token = artifacts.require("./QchainToken.sol");
let constants = require('./constants.js');

contract('Token.', function(accounts) {

    it('Should send tokens from the contract to the owner', function(done) {
        var contract;
        const amount = 10 * Math.pow(10, constants.decimals);

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(Token.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 0, 'Inititally contract should not have any tokens');
            // send some tokens to the contract itself
            return contract.distribute(Token.address, amount, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf.call(Token.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), amount, 'Contract was supposed to receive 10 tokens');
            return contract.balanceOf.call(constants.owner);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 0, 'Inititally owner should not have any tokens');
            return contract.transferERC20Token(Token.address);
        }).then(function(tx) {
            return contract.balanceOf.call(Token.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 0, 'Contract should not have any tokens');
            return contract.balanceOf.call(constants.owner);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), amount, 'Owner was supposed to receive 10 tokens');
        }).then(done);
    });
});
