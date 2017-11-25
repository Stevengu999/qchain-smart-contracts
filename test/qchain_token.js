let Token = artifacts.require('./QchainToken.sol');
let constants = require('./constants.js');


contract('QchainToken.', function(accounts) {

    /*
     *  Verify that initial contract state matches with expected state
     */

    it('Should verify decimals', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.decimals.call();
        }).then(function(number) {
            assert.equal(number.toNumber(), constants.decimals, 'Decimals do not match');
        }).then(done);
    });

    it('Should verify total supply', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.totalSupply.call();
        }).then(function(supply) {
            assert.equal(supply.toNumber(), constants.totalSupply, 'Total supply is incorrect');
        }).then(done);
    });

    it('Should verify allocation address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.icoAllocation.call();
        }).then(function(address) {
            assert.equal(address, constants.icoAllocation, 'Allocation address is incorrect');
        }).then(done);
    });

    it('Should verify allocation address balance', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(constants.icoAllocation);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), constants.allocationTokens, 
                         'Allocation address balance is incorrect');
        }).then(done);
    });

    it('Should verify preICO allocation address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.preIcoAllocation.call();
        }).then(function(address) {
            assert.equal(address, constants.preIcoAllocation, 'PreICO allocation address is incorrect');
        }).then(done);
    });

    it('Should verify preICO allocation address balance', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(constants.preIcoAllocation);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), constants.preIcoTokens, 
                         'PreICO allocation address balance is incorrect');
        }).then(done);
    });

    it('Should verify reserve address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.foundationReserve.call();
        }).then(function(address) {
            assert.equal(address, constants.foundationReserve, 'Foundation reserve address is incorrect');
        }).then(done);
    });

    it('Should verify reserve address balance', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(constants.foundationReserve);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), constants.foundationTokens, 
                         'Reserve address balance is incorrect');
        }).then(done);
    });

    it('Should verify multisig address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.multisig.call();
        }).then(function(address) {
            assert.equal(address, constants.multisig,
             'Multisig address on a contract doesn\'t match the one from the tests');
        }).then(done);
    });

    it('Should verify signer address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.signer.call();
        }).then(function(address) {
            assert.equal(address, constants.signer,
             'Signer address on a contract doesn\'t match the one from the tests');
        }).then(done);
    });


    /*
     * Verify that contract functions work as expected
     */

    it('Should verify that no one but owner can call withdrawFromReserve() function', function(done) {
        var contract;
        const amount = 10 * Math.pow(10, constants.decimals);

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.withdrawFromReserve(amount, { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call withdrawFromReserve() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: invalid opcode');
        }).then(done);
    });

    it('Should verify that owner can call withdrawFromReserve() function and the multisig receives tokens', function(done) {
        var contract;
        const amount = 123 * Math.pow(10, constants.decimals);
        let initialMultisigBalance;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf(constants.multisig);
        }).then(function(balance) {
            initialMultisigBalance = balance.toNumber();
            assert.equal(balance.toNumber(), 0, 'Initial multisig balance should be 0');
            return contract.withdrawFromReserve(amount, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf(constants.multisig);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), amount, 'Multisig balance should be equal to ' + amount);
        }).then(done);
    });

    it('Should verify that no one but owner can change multisig', function(done) {
        var contract;
        const newMultisig = '0x1234567890123456789012345678901234567890';

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.changeMultisig(newMultisig, { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call changeMultisig() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: invalid opcode');
        }).then(done);
    });

    it('Should verify that owner can change multisig', function(done) {
        var contract;
        const newMultisig = '0x1234567890123456789012345678901234567890';

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.changeMultisig(newMultisig, { from: constants.owner });
        }).then(function(tx) {
            return contract.multisig.call();
        }).then(function(multisig) {
            assert.equal(multisig, newMultisig, "Multisig address was supposed to be changed");
        }).then(done);
    });

    it('Should verify that no one but owner can distribute preICO allocation tokens', function(done) {
        var contract;
        const amount = 123 * Math.pow(10, constants.decimals);

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.transferFrom(
                constants.preIcoAllocation, constants.investor, amount,
                { from: constants.investor }
            );
        }).then(function(tx) {
            return contract.balanceOf(constants.investor);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 0, 'Investor balance should be equal to ' + amount);
            return contract.balanceOf(constants.preIcoAllocation);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), constants.preIcoTokens,
                 'preICO allocation address balance wasn\'t supposed to change');
        }).then(done);
    });

    it('Should verify that owner can distribute preICO allocation tokens', function(done) {
        var contract;
        const amount = 123 * Math.pow(10, constants.decimals);

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.transferFrom(
                constants.preIcoAllocation, constants.investor, amount,
                { from: constants.owner }
            );
        }).then(function(tx) {
            return contract.balanceOf(constants.investor);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), amount, 'Investor balance should be equal to ' + amount);
        }).then(done);
    });
});
