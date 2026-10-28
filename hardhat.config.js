require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ quiet: true });

const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// Jaringan Sepolia hanya diaktifkan kalau RPC URL dan private key diisi,
// jadi compile & test lokal tetap jalan tanpa file .env.
const networks = {};
if (SEPOLIA_RPC_URL && PRIVATE_KEY && /^(0x)?[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
  networks.sepolia = {
    url: SEPOLIA_RPC_URL,
    accounts: [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`],
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks,
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};
