import { formatEther } from "ethers";

/** 0x1234...abcd */
export function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** wei (bigint) -> string ETH, tanpa nol berlebih di belakang koma. */
export function formatEth(wei) {
  return formatEther(wei);
}

/** Persentase 0-100 (integer). Pakai bigint agar tidak ada error pembulatan. */
export function progressPercent(raised, goal) {
  if (goal === 0n) return 0;
  const pct = (raised * 100n) / goal;
  return Number(pct > 100n ? 100n : pct);
}

export function isGoalReached(raised, goal) {
  return raised >= goal;
}

/** Owner boleh withdraw: target tercapai dan belum pernah ditarik. */
export function canWithdraw({ owner, totalRaised, goal, withdrawn }, account) {
  if (!account || withdrawn) return false;
  return owner.toLowerCase() === account.toLowerCase() && isGoalReached(totalRaised, goal);
}

/** timestamp detik (bigint/number) -> teks tanggal lokal. */
export function formatTimestamp(seconds) {
  return new Date(Number(seconds) * 1000).toLocaleString("id-ID");
}

const CONTRACT_ERRORS = {
  EmptyTitle: "Judul tidak boleh kosong.",
  ZeroGoal: "Target harus lebih dari 0.",
  CampaignNotFound: "Kampanye tidak ditemukan.",
  ZeroDonation: "Jumlah donasi harus lebih dari 0.",
  NotCampaignOwner: "Hanya pemilik kampanye yang bisa menarik dana.",
  GoalNotReached: "Target belum tercapai, dana belum bisa ditarik.",
  AlreadyWithdrawn: "Dana kampanye ini sudah ditarik.",
  TransferFailed: "Transfer dana gagal.",
};

/** Ubah error dari ethers/MetaMask jadi pesan yang ramah pengguna. */
export function parseError(err) {
  if (!err) return "Terjadi kesalahan.";
  if (err.code === "ACTION_REJECTED" || err.code === 4001 || err.info?.error?.code === 4001) {
    return "Transaksi dibatalkan di wallet.";
  }
  const name = err.revert?.name;
  if (name && CONTRACT_ERRORS[name]) return CONTRACT_ERRORS[name];
  if (err.code === "INSUFFICIENT_FUNDS") return "Saldo ETH tidak cukup (termasuk biaya gas).";
  return err.shortMessage || err.message || "Terjadi kesalahan.";
}
