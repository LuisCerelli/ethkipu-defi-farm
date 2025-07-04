import { ethers } from "hardhat";
import addresses from "../deployed_addresses.json";

async function main() {
  const signer = (await ethers.getSigners())[0];
  const userAddress = await signer.getAddress();

  const lpTokenAddress = addresses.LPToken;
  const farmAddress = addresses.FarmProportionalBonus;

  const amount = ethers.parseUnits("100", 18); // Mint y depositar 100 LP

  // 1. Instanciar contratos
  const lpToken = await ethers.getContractAt("LPToken", lpTokenAddress);
  const farm = await ethers.getContractAt("FarmProportionalBonus", farmAddress);

  // 2. Mint LP tokens al usuario (debe ser el owner del LPToken)
  const tx1 = await lpToken.mint(userAddress, amount);
  await tx1.wait();
  console.log(`✅ Minted ${ethers.formatUnits(amount)} LP tokens to ${userAddress}`);

  // 3. Aprobar al contrato Farm para gastar LP tokens
  const approveTx = await lpToken.approve(farmAddress, amount);
  await approveTx.wait();
  console.log(`✅ Approved ${ethers.formatUnits(amount)} LP tokens to FarmProportionalBonus`);

  // 4. Depositar en Farm
  const depositTx = await farm.deposit(amount);
  await depositTx.wait();
  console.log(`✅ Deposited ${ethers.formatUnits(amount)} LP tokens into FarmProportionalBonus`);
}

main().catch((error) => {
  console.error("❌ Error en mint y depósito:", error);
  process.exitCode = 1;
});
