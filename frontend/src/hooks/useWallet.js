import { useCallback, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

/**
 * Menghubungkan app ke MetaMask (window.ethereum).
 * Mengembalikan akun aktif, chainId, signer, dan fungsi connect.
 */
export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);

  const hasWallet = typeof window !== "undefined" && Boolean(window.ethereum);

  const load = useCallback(async () => {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const accounts = await provider.send("eth_accounts", []);
    setChainId(network.chainId.toString());
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setSigner(await provider.getSigner(accounts[0]));
    } else {
      setAccount(null);
      setSigner(null);
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask tidak ditemukan. Install ekstensi MetaMask dulu.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await load();
    } catch (err) {
      setError(err.code === 4001 ? "Koneksi wallet dibatalkan." : "Gagal terhubung ke wallet.");
    }
  }, [load]);

  useEffect(() => {
    if (!hasWallet) return;
    // Pulihkan koneksi kalau situs sudah pernah diizinkan.
    load().catch(() => {});

    const onAccountsChanged = () => load().catch(() => {});
    // Ganti jaringan: reload agar seluruh state konsisten dengan chain baru.
    const onChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [hasWallet, load]);

  return { account, chainId, signer, error, hasWallet, connect };
}
