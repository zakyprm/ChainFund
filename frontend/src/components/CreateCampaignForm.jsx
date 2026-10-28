import { useState } from "react";
import { parseEther } from "ethers";
import { useTx } from "../hooks/useTx.js";

export default function CreateCampaignForm({ contract, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [formError, setFormError] = useState(null);
  const { run, pending, error } = useTx(onCreated);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    let goalWei;
    try {
      goalWei = parseEther(goal);
    } catch {
      setFormError("Target harus berupa angka ETH yang valid, mis. 1 atau 0.5.");
      return;
    }
    if (goalWei <= 0n) {
      setFormError("Target harus lebih dari 0.");
      return;
    }

    const ok = await run(() => contract.createCampaign(title.trim(), description.trim(), goalWei));
    if (ok) {
      setTitle("");
      setDescription("");
      setGoal("");
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="Buat kampanye">
      <h2>Buat kampanye</h2>
      <label>
        Judul
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
      </label>
      <label>
        Deskripsi
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </label>
      <label>
        Target (ETH)
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          inputMode="decimal"
          placeholder="1.0"
          required
        />
      </label>
      {(formError || error) && (
        <p className="error" role="alert">
          {formError || error}
        </p>
      )}
      <div>
        <button type="submit" disabled={pending || !title.trim()}>
          {pending ? "Menunggu konfirmasi..." : "Buat kampanye"}
        </button>
      </div>
    </form>
  );
}
