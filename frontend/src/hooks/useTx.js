import { useCallback, useState } from "react";
import { parseError } from "../lib/format.js";

/**
 * Menjalankan fungsi yang mengirim transaksi, menunggu konfirmasi,
 * dan melacak status (pending / error). `run` mengembalikan true kalau sukses.
 */
export function useTx(onSuccess) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (sendTx) => {
      setPending(true);
      setError(null);
      try {
        const tx = await sendTx();
        await tx.wait();
        if (onSuccess) await onSuccess();
        return true;
      } catch (err) {
        setError(parseError(err));
        return false;
      } finally {
        setPending(false);
      }
    },
    [onSuccess]
  );

  return { run, pending, error };
}
