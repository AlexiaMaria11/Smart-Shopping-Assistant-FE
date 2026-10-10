import { http } from "../base/http";

export interface Features {
  aiAssistant: boolean;
}

let cached: Promise<Features> | null = null;

// Optional features turned on by the server; asked once per page load
export const featuresApi = {
  get: (): Promise<Features> => {
    cached ??= http.get<Features>("/features").catch(() => {
      cached = null;
      return { aiAssistant: false };
    });
    return cached;
  },
};
