import { shortAddress } from "../lib/format.js";

export default function WalletBar({ account, hasWallet, onConnect }) {
  if (!hasWallet) {
    return (
      <p className="error" role="alert">
        MetaMask tidak terdeteksi. Install ekstensi MetaMask untuk memakai ChainFund.
      </p>
    );
  }
  if (!account) {
    return <button onClick={onConnect}>Hubungkan MetaMask</button>;
  }
  return (
    <span className="muted" title={account}>
      Terhubung: <strong>{shortAddress(account)}</strong>
    </span>
  );
}
