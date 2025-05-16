// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreeToken is ERC20, Ownable {
    constructor() ERC20("TreeToken", "TREE") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function airdrop(address[] memory recipients, uint256 amount) public onlyOwner {
        uint256 totalAmount = amount * recipients.length;
        require(balanceOf(msg.sender) >= totalAmount, "Not enough tokens for airdrop");

        for (uint i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amount);
        }
    }
}
