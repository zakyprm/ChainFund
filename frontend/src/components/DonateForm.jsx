import { useState } from "react";
import { parseEther } from "ethers";
import { useTx } from "../hooks/useTx.js";

export default function DonateForm({ contract, campaignId, onDonated }) {
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState(null);
  const { run, pending, error } = useTx(onDonated);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    let wei;
    try {
      wei = parseEther(amount);
    } catch {
      setFormError("Jumlah harus berupa angka ETH yang valid, mis. 0.1.");
      return;
    }
    if (wei <= 0n) {
      setFormError("Jumlah donasi harus lebih dari 0.");
      return;
    }

    const ok = await run(() => contract.donate(campaignId, { value: wei }));
    if (ok) setAmount("");
  }

  return (
    <form onSubmit={handleSubmit} aria-label={`Donasi ke kampanye ${campaignId}`}>
      <div className="row">
        <label>
          Jumlah donasi (ETH)
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0.1"
            required
          />
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "Menunggu konfirmasi..." : "Donasi"}
        </button>
      </div>
      {(formError || error) && (
        <p className="error" role="alert">
          {formError || error}
        </p>
      )}
    </form>
  );
}
