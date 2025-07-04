import { ethers } from "hardhat";
import addresses from "../deployed_addresses.json";

async function main() {
  const signer = (await ethers.getSigners())[0];
  const userAddress = await signer.getAddress();

  const farmAddress = addresses.FarmProportionalBonus;
  const farm = await ethers.getContractAt("FarmProportionalBonus", farmAddress);

  // Reclamar recompensas
  const claimTx = await farm.claimRewards();
  await claimTx.wait();
  console.log(`✅ Recompensas reclamadas para ${userAddress}`);

  // Obtener cantidad stakeada actual
  const staker = await farm.stakers(userAddress);
  const amountStaked = staker.amount;

  // Verificar si la cantidad es cero con bigint
  if (amountStaked === 0n) {
    console.log("⚠️ No tienes LP tokens stakeados para retirar");
    return;
  }

  // Retirar todos los LP tokens
  const withdrawTx = await farm.withdraw(amountStaked);
  await withdrawTx.wait();
  console.log(`✅ Retirados ${ethers.formatUnits(amountStaked)} LP tokens para ${userAddress}`);
}

main().catch((error) => {
  console.error("❌ Error en claim y withdraw:", error);
  process.exitCode = 1;
});
