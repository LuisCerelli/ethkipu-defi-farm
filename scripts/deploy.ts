import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const LPToken = await ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy();
  await lpToken.waitForDeployment();
  const lpAddress = await lpToken.getAddress();
  console.log("✅ LPToken deployed to:", lpAddress);

  const DAPToken = await ethers.getContractFactory("DAPToken");
  const dapToken = await DAPToken.deploy();
  await dapToken.waitForDeployment();
  const dapAddress = await dapToken.getAddress();
  console.log("✅ DAPToken deployed to:", dapAddress);

  // Guardar las direcciones en un archivo
  const addresses = {
    LPToken: lpAddress,
    DAPToken: dapAddress,
  };
  fs.writeFileSync("deployed_addresses.json", JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
