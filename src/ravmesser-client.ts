import { createHash, randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import type { RavMesserCredentials } from "./types/api.js";

const BASE_URL = "https://api.responder.co.il/main";

function loadFromKeychain(service: string): string | null {
  try {
    return execSync(`security find-generic-password -s "${service}" -w 2>/dev/null`, {
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

function loadCredentials(): RavMesserCredentials {
  const cKey = loadFromKeychain("responder-c-key") || process.env.RESPONDER_C_KEY;
  const cSecret = loadFromKeychain("responder-c-secret") || process.env.RESPONDER_C_SECRET;
  const uKey = loadFromKeychain("responder-u-key") || process.env.RESPONDER_U_KEY;
  const uSecret = loadFromKeychain("responder-u-secret") || process.env.RESPONDER_U_SECRET;

  if (!cKey || !cSecret || !uKey || !uSecret) {
    throw new Error(
      "Missing Rav Messer credentials. Store them in macOS Keychain " +
      "(responder-c-key, responder-c-secret, responder-u-key, responder-u-secret) " +
      "or set env vars (RESPONDER_C_KEY, RESPONDER_C_SECRET, RESPONDER_U_KEY, RESPONDER_U_SECRET)."
    );
  }

  return { cKey, cSecret, uKey, uSecret };
}

export class RavMesserClient {
  private credentials: RavMesserCredentials;

  constructor() {
    this.credentials = loadCredentials();
  }

  private buildAuthHeader(): string {
    const nonce = randomUUID().replace(/-/g, "");
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const cSecretHash = createHash("md5")
      .update(this.credentials.cSecret + nonce)
      .digest("hex");

    const uSecretHash = createHash("md5")
      .update(this.credentials.uSecret + nonce)
      .digest("hex");

    const parts = [
      `c_key=${encodeURIComponent(this.credentials.cKey)}`,
      `c_secret=${encodeURIComponent(cSecretHash)}`,
      `u_key=${encodeURIComponent(this.credentials.uKey)}`,
      `u_secret=${encodeURIComponent(uSecretHash)}`,
      `nonce=${encodeURIComponent(nonce)}`,
      `timestamp=${encodeURIComponent(timestamp)}`,
    ];

    return parts.join(",");
  }

  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: Record<string, string>
  ): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
      Authorization: this.buildAuthHeader(),
    };

    const options: RequestInit = { method, headers };

    if (body && (method === "POST" || method === "PUT")) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(body)) {
        params.append(key, value);
      }
      options.body = params.toString();
    }

    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      // Retry once on network error
      try {
        options.headers = { ...headers, Authorization: this.buildAuthHeader() };
        response = await fetch(url, options);
      } catch (retryError) {
        throw new Error(
          `Network error calling Rav Messer API: ${retryError instanceof Error ? retryError.message : "Unknown error"}`
        );
      }
    }

    const text = await response.text();

    if (!response.ok) {
      let errorDetail = text;
      try {
        const parsed = JSON.parse(text);
        if (parsed.ERRORS) {
          errorDetail = JSON.stringify(parsed.ERRORS);
        } else if (parsed.error) {
          errorDetail = parsed.error;
        }
      } catch {
        // text is already the error detail
      }
      throw new Error(`Rav Messer API error (${response.status}): ${errorDetail}`);
    }

    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Invalid JSON response from Rav Messer API: ${text.slice(0, 200)}`);
    }
  }
}
