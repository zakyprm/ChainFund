import { useTx } from "../hooks/useTx.js";

export default function WithdrawButton({ contract, campaignId, onWithdrawn }) {
  const { run, pending, error } = useTx(onWithdrawn);

  return (
    <div>
      <button onClick={() => run(() => contract.withdraw(campaignId))} disabled={pending}>
        {pending ? "Menunggu konfirmasi..." : "Tarik dana"}
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
