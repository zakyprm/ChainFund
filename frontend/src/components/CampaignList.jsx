import CampaignCard from "./CampaignCard.jsx";

export default function CampaignList({ campaigns, loading, error, contract, account, onChanged }) {
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (loading && campaigns.length === 0) {
    return <p className="muted">Memuat kampanye...</p>;
  }
  if (campaigns.length === 0) {
    return <p className="muted">Belum ada kampanye. Buat yang pertama!</p>;
  }
  return (
    <section aria-label="Daftar kampanye">
      {campaigns.map((c) => (
        <CampaignCard
          key={c.id}
          campaign={c}
          contract={contract}
          account={account}
          onChanged={onChanged}
        />
      ))}
    </section>
  );
}
