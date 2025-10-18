import { AxiosError } from "axios";

export function handleAxiosError(error: unknown,  fallbackMessage: string): never {
  if (import.meta.env.VITE_DEV) {
    console.error("authApi error:", error);
  }

  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || fallbackMessage);
  }

  throw new Error(fallbackMessage);
}
