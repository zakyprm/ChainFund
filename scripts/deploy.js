const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

const OUTPUT_DIR = path.join(__dirname, "..", "frontend", "src", "contract");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "ChainFund.json");

/**
 * Simpan ABI + alamat contract untuk dipakai frontend.
 * Alamat disimpan per chainId, jadi deploy ke jaringan lain tidak menimpa yang lama.
 */
async function exportForFrontend(address, chainId) {
  const artifact = await hre.artifacts.readArtifact("ChainFund");

  let addresses = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    addresses = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8")).addresses ?? {};
  }
  addresses[chainId] = address;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify({ abi: artifact.abi, addresses }, null, 2) + "\n"
  );
  console.log(`ABI + address diekspor ke: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

async function main() {
  const chainFund = await hre.ethers.deployContract("ChainFund");
  await chainFund.waitForDeployment();

  const address = await chainFund.getAddress();
  const { chainId } = await hre.ethers.provider.getNetwork();

  console.log(`ChainFund deployed to: ${address}`);
  console.log(`Network: ${hre.network.name} (chainId ${chainId})`);

  // Jaringan in-process "hardhat" hilang setelah script selesai, tidak perlu diekspor.
  if (hre.network.name !== "hardhat") {
    await exportForFrontend(address, chainId.toString());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
