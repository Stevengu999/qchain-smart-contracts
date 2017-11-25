pragma solidity ^0.4.15;
import "./util/Token.sol";


/// @title Token contract - Implements Standard ERC20 Token for Qchain project.
/// @author Zerion - <inbox@zerion.io>
contract QchainToken is Token {

    /*
     * Token meta data
     */
    string constant public name = "Ethereum Qchain Token";
    string constant public symbol = "EQC";
    uint8 constant public decimals = 8;

    // Address where Foundation tokens are allocated
    address constant public foundationReserve = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    // Address where all tokens for the ICO stage are initially allocated
    address constant public icoAllocation = 0x1111111111111111111111111111111111111111;

    // Address where all tokens for the PreICO are initially allocated
    address constant public preIcoAllocation = 0x2222222222222222222222222222222222222222;

    // ICO start date. 10/24/2017 @ 9:00pm (UTC)
    uint256 constant public startDate = 1508878800;
    uint256 constant public duration = 42 days;

    // Public key of the signer
    address public signer;

    // Foundation multisignature wallet, all Ether is collected there
    address public multisig;

    /// @dev Contract constructor, sets totalSupply
    function QchainToken(address _signer, address _multisig)
    {
        // Overall, 375,000,000 EQC tokens are distributed
        totalSupply = withDecimals(375000000, decimals);

        // 11,500,000 tokens were sold during the PreICO
        uint preIcoTokens = withDecimals(11500000, decimals);

        // 40% of total supply is allocated for the Foundation
        balances[foundationReserve] = div(mul(totalSupply, 40), 100);

        // PreICO tokens are allocated to the special address and will be distributed manually
        balances[preIcoAllocation] = preIcoTokens;

        // The rest of the tokens is available for sale
        balances[icoAllocation] = totalSupply - preIcoTokens - balanceOf(foundationReserve);

        // Allow the owner to distribute tokens from the PreICO allocation address
        allowed[preIcoAllocation][msg.sender] = balanceOf(preIcoAllocation);

        // Allow the owner to withdraw tokens from the Foundation reserve
        allowed[foundationReserve][msg.sender] = balanceOf(foundationReserve);

        signer = _signer;
        multisig = _multisig;
    }

    modifier icoIsActive {
        require(now >= startDate && now < startDate + duration);
        _;
    }

    modifier icoIsCompleted {
        require(now >= startDate + duration);
        _;
    }

    /// @dev Settle an investment and distribute tokens
    function invest(address investor, uint256 tokenPrice, uint256 value, bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        public
        icoIsActive
        payable
    {
        // Check the hash
        require(sha256(uint(investor) << 96 | tokenPrice) == hash);

        // Check the signature
        require(ecrecover(hash, v, r, s) == signer);

        // Difference between the value argument and actual value should not be
        // more than 0.005 ETH (gas commission)
        require(sub(value, msg.value) <= withDecimals(5, 15));

        // Number of tokens to distribute
        uint256 tokensNumber = div(withDecimals(value, decimals), tokenPrice);

        // Check if there is enough tokens left
        require(balances[icoAllocation] >= tokensNumber);

        // Send Ether to the multisig
        require(multisig.send(msg.value));

        // Allocate tokens to an investor
        balances[icoAllocation] -= tokensNumber;
        balances[investor] += tokensNumber;
        Transfer(icoAllocation, investor, tokensNumber);
    }

    /// @dev Overrides Owned.sol function
    function confirmOwnership()
        public
        onlyPotentialOwner
    {
        // Allow new owner to withdraw tokens from Foundation reserve and
        // preICO allocation address
        allowed[foundationReserve][potentialOwner] = balanceOf(foundationReserve);
        allowed[preIcoAllocation][potentialOwner] = balanceOf(preIcoAllocation);

        // Forbid old owner to withdraw tokens from Foundation reserve and
        // preICO allocation address
        allowed[foundationReserve][owner] = 0;
        allowed[preIcoAllocation][owner] = 0;

        // Change owner
        super.confirmOwnership();
    }

    /// @dev Withdraws tokens from Foundation reserve
    function withdrawFromReserve(uint amount)
        public
        onlyOwner
    {
        // Withdraw tokens from Foundation reserve to multisig address
        require(transferFrom(foundationReserve, multisig, amount));
    }

    /// @dev Changes multisig address
    function changeMultisig(address _multisig)
        public
        onlyOwner
    {
        multisig = _multisig;
    }

    /// @dev Burns the rest of the tokens after the crowdsale end
    function burn()
        public
        onlyOwner
        icoIsCompleted
    {
        totalSupply = sub(totalSupply, balanceOf(icoAllocation));
        balances[icoAllocation] = 0;
    }
}
