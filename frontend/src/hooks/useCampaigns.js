import { useCallback, useEffect, useState } from "react";
import { parseError } from "../lib/format.js";

/** Ubah hasil ethers (Result) jadi objek biasa. */
function toCampaign(id, c, donations) {
  return {
    id,
    owner: c.owner,
    title: c.title,
    description: c.description,
    goal: c.goal,
    totalRaised: c.totalRaised,
    withdrawn: c.withdrawn,
    donations: donations.map((d) => ({
      donor: d.donor,
      amount: d.amount,
      timestamp: d.timestamp,
    })),
  };
}

/** Memuat semua kampanye beserta riwayat donasinya dari contract. */
export function useCampaigns(contract) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const count = Number(await contract.getCampaignCount());
      const ids = Array.from({ length: count }, (_, i) => i);
      const loaded = await Promise.all(
        ids.map(async (id) => {
          const [c, donations] = await Promise.all([
            contract.getCampaign(id),
            contract.getDonations(id),
          ]);
          return toCampaign(id, c, donations);
        })
      );
      // Kampanye terbaru di atas.
      setCampaigns(loaded.reverse());
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { campaigns, loading, error, refresh };
}
