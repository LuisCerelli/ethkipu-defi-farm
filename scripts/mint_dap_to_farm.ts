import { ethers } from "hardhat";
import addresses from "../deployed_addresses.json";

async function main() {
  const dapTokenAddress = addresses.DAPToken;
  const farmAddress = addresses.FarmProportionalBonus;

  const dapToken = await ethers.getContractAt("DAPToken", dapTokenAddress);

  // Cantidad a mintear (por ejemplo 1000 DAP)
  const amount = ethers.parseUnits("1000", 18);

  // Mint tokens al contrato Farm
  const tx = await dapToken.mint(farmAddress, amount);
  await tx.wait();

  console.log(`✅ Minted ${ethers.formatUnits(amount)} DAP tokens to Farm contract at ${farmAddress}`);
}

main().catch((error) => {
  console.error("❌ Error minting DAP tokens:", error);
  process.exitCode = 1;
});
