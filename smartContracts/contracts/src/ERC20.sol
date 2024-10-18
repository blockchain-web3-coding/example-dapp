// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    event TokensMinted(address indexed to, uint256 amount);

    constructor()
        ERC20("TestToken", "MTK")
    {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}
