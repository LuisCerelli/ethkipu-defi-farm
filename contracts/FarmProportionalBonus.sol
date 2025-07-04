// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FarmProportionalBonus - Farm con bonus y lógica de rewards proporcional al total stakeado
contract FarmProportionalBonus is Ownable {
    IERC20 public lpToken;
    IERC20 public dapToken;

    uint256 public rewardPerBlock; // Recompensa total generada por bloque
    uint256 public withdrawalFee;  // En porcentaje, por ejemplo: 2 = 2%
    address public treasury;

    uint256 public totalStaking; // Total LP en staking

    struct Staker {
        uint256 amount;      // LP tokens depositados
        uint256 checkpoint;  // Último bloque donde se calcularon rewards
        uint256 pending;     // Recompensas acumuladas no reclamadas
    }

    mapping(address => Staker) public stakers;
    address[] public stakerList;

    modifier onlyStaker() {
        require(stakers[msg.sender].amount > 0, "No estas en staking");
        _;
    }

    constructor(address _lpToken, address _dapToken, uint256 _rewardPerBlock) Ownable(msg.sender) {
        lpToken = IERC20(_lpToken);
        dapToken = IERC20(_dapToken);
        rewardPerBlock = _rewardPerBlock;
        treasury = msg.sender;
        withdrawalFee = 0;
    }

    function deposit(uint256 _amount) external {
        require(_amount > 0, "Cantidad invalida");

        // Si ya tenía LP, distribuimos primero los rewards acumulados
        _distributeReward(msg.sender);

        lpToken.transferFrom(msg.sender, address(this), _amount);

        if (stakers[msg.sender].amount == 0) {
            stakerList.push(msg.sender);
        }

        stakers[msg.sender].amount += _amount;
        stakers[msg.sender].checkpoint = block.number;

        totalStaking += _amount;
    }

    function withdraw(uint256 _amount) external onlyStaker {
        require(_amount > 0, "Cantidad invalida");
        require(stakers[msg.sender].amount >= _amount, "Saldo insuficiente");

        _distributeReward(msg.sender);

        stakers[msg.sender].amount -= _amount;
        totalStaking -= _amount;

        uint256 fee = (_amount * withdrawalFee) / 100;
        uint256 netAmount = _amount - fee;

        if (fee > 0) {
            lpToken.transfer(treasury, fee);
        }
        lpToken.transfer(msg.sender, netAmount);

        stakers[msg.sender].checkpoint = block.number;
    }

    function claimRewards() external onlyStaker {
        _distributeReward(msg.sender);

        uint256 reward = stakers[msg.sender].pending;
        require(reward > 0, "No hay recompensas");

        stakers[msg.sender].pending = 0;
        stakers[msg.sender].checkpoint = block.number;

        dapToken.transfer(msg.sender, reward);
    }

    

    

    function _distributeReward(address user) internal {
        Staker storage staker = stakers[user];

        if (staker.amount == 0 || totalStaking == 0) return;

        uint256 blocks = block.number - staker.checkpoint;
        if (blocks == 0) return;

        uint256 share = (staker.amount * 1e18) / totalStaking;
        uint256 reward = (rewardPerBlock * blocks * share) / 1e18;

        staker.pending += reward;
    }
    /// @notice Actualiza la recompensa por bloque
    function setRewardPerBlock(uint256 _newReward) external onlyOwner {
        require(_newReward > 0, "Recompensa invalida");
        rewardPerBlock = _newReward;
    }
    
    /// @notice Actualiza la tasa de fee de retiro
    function setWithdrawalFee(uint256 _fee) external onlyOwner {
        require(_fee <= 100, "Fee invalido");
        withdrawalFee = _fee;
    }

    function setTreasury(address _addr) external onlyOwner {
        require(_addr != address(0), "Tesoreria invalida");
        treasury = _addr;
    }

    // Opcional: visualizar stakers activos
    function getStakers() external view returns (address[] memory) {
        return stakerList;
    }
}
