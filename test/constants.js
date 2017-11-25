function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}


define('owner', '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a');
define('newOwner', '0xf1f42f995046e67b79dd5ebafd224ce964740da3');
define('investor', '0xd646e8c228bfcc0ec6067ad909a34f14f45513b0');
define('signer', '0x3a16f7fe44290f460ece714f078f0a0aecec1123');
define('multisig', '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
define('decimals', 8);
define('totalSupply', 375000000 * Math.pow(10, this.decimals));
define('foundationTokens', Math.floor(this.totalSupply * 0.4));
define('preIcoTokens', 11500000 * Math.pow(10, this.decimals));
define('allocationTokens', this.totalSupply - this.foundationTokens - this.preIcoTokens);
define('foundationReserve', '0xffffffffffffffffffffffffffffffffffffffff');
define('icoAllocation', '0x1111111111111111111111111111111111111111');
define('preIcoAllocation', '0x2222222222222222222222222222222222222222');
