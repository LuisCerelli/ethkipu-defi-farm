import { ethers } from "hardhat";
import addresses from "../deployed_addresses.json";

async function main() {
  const lpTokenAddress = addresses.LPToken;

  // Dirección de tu wallet
  const userAddress = "0xC55C51964c944D7AefAAd511FB061335907DBd7d";

  // Instanciamos el contrato LPToken
  const lpToken = await ethers.getContractAt("LPToken", lpTokenAddress);

  // Obtenemos el balance
  const balance = await lpToken.balanceOf(userAddress);

  console.log(`📊 Balance LP de ${userAddress}: ${ethers.formatUnits(balance)} MLP`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
