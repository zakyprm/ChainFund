import { Contract } from "ethers";
import deployment from "../contract/ChainFund.json";

/** Alamat contract untuk chainId tertentu, atau null kalau belum di-deploy di sana. */
export function getContractAddress(chainId) {
  return deployment.addresses[String(chainId)] ?? null;
}

export function getSupportedChainIds() {
  return Object.keys(deployment.addresses);
}

/** Buat instance Contract. Kirim signer untuk transaksi, provider untuk baca saja. */
export function getContract(runner, chainId) {
  const address = getContractAddress(chainId);
  if (!address) return null;
  return new Contract(address, deployment.abi, runner);
}
