// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title LPToken - Token ERC-20 que simula tokens de Liquidity Pool (LP)
/// @author Luis
contract LPToken is ERC20, Ownable {
    constructor() ERC20("Mock LP Token", "MLP") Ownable(msg.sender) {}

    /// @notice Mintea tokens LP al usuario
    /// @param to Dirección que recibirá los tokens
    /// @param amount Cantidad de tokens a mintear (con decimales incluidos)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
