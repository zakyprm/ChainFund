import { useWallet } from "./hooks/useWallet.js";
import { getContractAddress, getSupportedChainIds } from "./lib/contract.js";
import WalletBar from "./components/WalletBar.jsx";

export default function App() {
  const { account, chainId, error, hasWallet, connect } = useWallet();
  const contractAddress = chainId ? getContractAddress(chainId) : null;

  return (
    <main className="container">
      <header className="app-header">
        <div>
          <h1>ChainFund</h1>
          <p className="muted">Platform donasi di atas Ethereum.</p>
        </div>
        <WalletBar account={account} hasWallet={hasWallet} onConnect={connect} />
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {account && !contractAddress && (
        <p className="card error" role="alert">
          Contract belum di-deploy di jaringan ini (chainId {chainId}). Pindah ke jaringan dengan
          chainId: {getSupportedChainIds().join(", ")}.
        </p>
      )}

      {account && contractAddress && (
        <p className="muted">Contract: {contractAddress}</p>
      )}
    </main>
  );
}
