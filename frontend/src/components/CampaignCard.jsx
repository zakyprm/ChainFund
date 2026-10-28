import {
  formatEth,
  formatTimestamp,
  progressPercent,
  shortAddress,
} from "../lib/format.js";

export default function CampaignCard({ campaign }) {
  const { id, title, description, owner, goal, totalRaised, withdrawn, donations } = campaign;
  const percent = progressPercent(totalRaised, goal);

  return (
    <article className="card" aria-labelledby={`campaign-${id}`}>
      <h3 id={`campaign-${id}`}>{title}</h3>
      <p>{description}</p>
      <p className="muted">Pemilik: {shortAddress(owner)}</p>

      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Progres donasi ${title}`}
      >
        <div style={{ width: `${percent}%` }} />
      </div>
      <p>
        {formatEth(totalRaised)} / {formatEth(goal)} ETH ({percent}%)
        {withdrawn && <span className="success"> - dana sudah ditarik</span>}
      </p>

      <details>
        <summary>Riwayat donasi ({donations.length})</summary>
        {donations.length === 0 ? (
          <p className="muted">Belum ada donasi.</p>
        ) : (
          <ul className="donations">
            {donations.map((d, i) => (
              <li key={i}>
                {shortAddress(d.donor)} - {formatEth(d.amount)} ETH
                <span className="muted"> ({formatTimestamp(d.timestamp)})</span>
              </li>
            ))}
          </ul>
        )}
      </details>
    </article>
  );
}
