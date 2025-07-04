// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title DAPToken - Token ERC-20 que representa las recompensas del farming
/// @author Luis
contract DAPToken is ERC20, Ownable {
    constructor() ERC20("DAP Reward Token", "DAP") Ownable(msg.sender) {}

    /// @notice Mintea tokens de recompensa al usuario
    /// @param to Dirección que recibirá los tokens
    /// @param amount Cantidad de tokens a mintear (con decimales incluidos)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
