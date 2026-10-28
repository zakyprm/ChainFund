import { useMemo } from "react";
import { useWallet } from "./hooks/useWallet.js";
import { useCampaigns } from "./hooks/useCampaigns.js";
import { getContract, getContractAddress, getSupportedChainIds } from "./lib/contract.js";
import WalletBar from "./components/WalletBar.jsx";
import CampaignList from "./components/CampaignList.jsx";
import CreateCampaignForm from "./components/CreateCampaignForm.jsx";

export default function App() {
  const { account, chainId, signer, error, hasWallet, connect } = useWallet();
  const contractAddress = chainId ? getContractAddress(chainId) : null;

  // Signer dipakai agar nanti bisa kirim transaksi; untuk baca juga bisa.
  const contract = useMemo(
    () => (signer && contractAddress ? getContract(signer, chainId) : null),
    [signer, chainId, contractAddress]
  );

  const { campaigns, loading, error: loadError, refresh } = useCampaigns(contract);

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

      {contract && (
        <>
          <p className="muted">Contract: {contractAddress}</p>
          <CreateCampaignForm contract={contract} onCreated={refresh} />
          <h2>Kampanye</h2>
          <CampaignList campaigns={campaigns} loading={loading} error={loadError} />
        </>
      )}
    </main>
  );
}
