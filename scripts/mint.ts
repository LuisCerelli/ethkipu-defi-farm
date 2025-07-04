import { ethers } from "hardhat";
import addresses from "../deployed_addresses.json";

async function main() {
  // Dirección del contrato LPToken desplegado en Sepolia
  const lpTokenAddress = addresses.LPToken;

  // Dirección del destinatario (tu wallet en Sepolia)
  const recipient = "0xC55C51964c944D7AefAAd511FB061335907DBd7d";

  // Cantidad a mintear (por ejemplo, 100 tokens con 18 decimales)
  const amount = ethers.parseUnits("100", 18);

  // Validación rápida
  if (!ethers.isAddress(lpTokenAddress) || !ethers.isAddress(recipient)) {
    throw new Error("❌ Dirección inválida en el script");
  }

  // Instanciar contrato LPToken
  const lpToken = await ethers.getContractAt("LPToken", lpTokenAddress);

  // Ejecutar mint
  const tx = await lpToken.mint(recipient, amount);
  console.log("🪙 Minting LP tokens...");
  await tx.wait();

  console.log(`✅ Minted ${ethers.formatUnits(amount)} LP tokens to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
