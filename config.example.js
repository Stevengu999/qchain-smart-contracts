function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Mainnet settings
define('ownerMainnet', '<OWNER ADDRESS>');
define('contractMainnet', '<CONTRACT ADDRESS>');
define('privateKeyMainnet', '<OWNER PRIVATE KEY>');
define('urlMainnet', '<NODE IP>');
define('decimals', 8);

// Kovan settings
define('ownerKovan', '0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a');
define('privateKeyKovan', '83c14ddb845e629975e138a5c28ad5a72a49252ea65b3d3ec99810c82751cc3a');
define('urlKovan', '52.57.192.243:8546');