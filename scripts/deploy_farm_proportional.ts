import { ethers } from "hardhat";
import addresses from "../deployed_addresses.json";
import fs from "fs";

async function main() {
  const lpTokenAddress = addresses.LPToken;
  const dapTokenAddress = addresses.DAPToken;
  const rewardPerBlock = ethers.parseUnits("1", 18); // 1 DAP por bloque

  const FarmProportionalBonus = await ethers.getContractFactory("FarmProportionalBonus");
  const farmProportional = await FarmProportionalBonus.deploy(lpTokenAddress, dapTokenAddress, rewardPerBlock);
  await farmProportional.waitForDeployment();

  const farmProportionalAddress = await farmProportional.getAddress();
  console.log("✅ FarmProportionalBonus deployed to:", farmProportionalAddress);

  // Guardar la nueva dirección en el JSON
  const updated = {
    ...addresses,
    FarmProportionalBonus: farmProportionalAddress,
  };
  fs.writeFileSync("deployed_addresses.json", JSON.stringify(updated, null, 2));
}

main().catch((error) => {
  console.error("❌ Error al desplegar FarmProportionalBonus:", error);
  process.exitCode = 1;
});
