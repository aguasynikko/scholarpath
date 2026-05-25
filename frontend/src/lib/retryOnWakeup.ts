import axios from "axios";

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 8000;

export async function retryOnWakeup<T>(
  fn: () => Promise<T>,
  onWakingUp: (waking: boolean) => void
): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await fn();
      onWakingUp(false);
      return result;
    } catch (err) {
      const isNetworkError =
        axios.isAxiosError(err) &&
        (err.code === "ERR_NETWORK" ||
          err.code === "ECONNABORTED" ||
          err.response?.status === 502 ||
          err.response?.status === 503 ||
          err.response?.status === 504);

      if (isNetworkError && attempt < MAX_RETRIES) {
        onWakingUp(true);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      onWakingUp(false);
      throw err;
    }
  }
  throw new Error("Server unavailable after multiple retries.");
}
