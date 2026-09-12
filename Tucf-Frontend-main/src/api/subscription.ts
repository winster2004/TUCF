import axios from "axios";

export type SubscriptionRole = "FREE" | "STARTER" | "PRO";

export interface SubscriptionStatusResponse {
  role: SubscriptionRole;
  message?: string;
}

export interface SubscriptionUpgradeResponse {
  role: SubscriptionRole;
  message?: string;
}

interface ApiErrorPayload {
  message?: string | string[];
  error?: string;
}

export class SubscriptionApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "SubscriptionApiError";
    this.status = status;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000";

const subscriptionApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

subscriptionApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const requestPath = String(config.url ?? "");
  const requestedUrl = /^https?:\/\//i.test(requestPath)
    ? requestPath
    : `${String(config.baseURL ?? API_BASE_URL).replace(/\/+$/, "")}/${requestPath.replace(
        /^\/+/,
        "",
      )}`;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("[UPGRADE API REQUEST]", {
    method: String(config.method ?? "get").toUpperCase(),
    requestedUrl,
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 12)}...` : null,
  });

  return config;
});

const normalizeRole = (value: string): SubscriptionRole | null => {
  const upper = value.trim().toUpperCase();
  if (upper === "FREE" || upper === "STARTER" || upper === "PRO") {
    return upper;
  }

  return null;
};

const hasRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readRoleFromRecord = (
  record: Record<string, unknown>,
): SubscriptionRole | null => {
  const direct = record.role;
  if (typeof direct === "string") {
    const normalized = normalizeRole(direct);
    if (normalized) {
      return normalized;
    }
  }

  const user = record.user;
  if (hasRecord(user) && typeof user.role === "string") {
    const normalized = normalizeRole(user.role);
    if (normalized) {
      return normalized;
    }
  }

  const subscription = record.subscription;
  if (hasRecord(subscription) && typeof subscription.role === "string") {
    const normalized = normalizeRole(subscription.role);
    if (normalized) {
      return normalized;
    }
  }

  return null;
};

const parseApiMessage = (payload: unknown): string | undefined => {
  if (!hasRecord(payload)) {
    return undefined;
  }

  const message = payload.message;
  if (Array.isArray(message)) {
    const joined = message
      .filter((item): item is string => typeof item === "string")
      .join(", ");
    return joined || undefined;
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  return undefined;
};

const parseSubscriptionResponse = <
  T extends SubscriptionStatusResponse | SubscriptionUpgradeResponse,
>(
  data: unknown,
  fallbackMessage: string,
): T => {
  if (!hasRecord(data)) {
    throw new SubscriptionApiError(fallbackMessage);
  }

  const role = readRoleFromRecord(data);
  if (!role) {
    throw new SubscriptionApiError(
      "Could not determine current subscription role.",
    );
  }

  const message = parseApiMessage(data);
  return {
    role,
    message,
  } as T;
};

const parseSubscriptionError = (
  error: unknown,
  fallbackMessage: string,
): SubscriptionApiError => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    if (Array.isArray(payload?.message)) {
      const mergedMessage = payload.message.join(", ");
      return new SubscriptionApiError(
        mergedMessage || fallbackMessage,
        error.response?.status,
      );
    }

    const message =
      (typeof payload?.message === "string" &&
        payload.message.trim() &&
        payload.message) ||
      (typeof payload?.error === "string" &&
        payload.error.trim() &&
        payload.error) ||
      error.message ||
      fallbackMessage;

    return new SubscriptionApiError(message, error.response?.status);
  }

  if (error instanceof Error) {
    return new SubscriptionApiError(error.message || fallbackMessage);
  }

  return new SubscriptionApiError(fallbackMessage);
};

export const getSubscriptionStatus =
  async (): Promise<SubscriptionStatusResponse> => {
    try {
      const response = await subscriptionApi.get<unknown>(
        "/subscription/status",
      );
      const parsed = parseSubscriptionResponse<SubscriptionStatusResponse>(
        response.data,
        "Failed to fetch subscription status.",
      );
      console.log("[UPGRADE API RESPONSE]", {
        endpoint: "/subscription/status",
        role: parsed.role,
        message: parsed.message ?? null,
      });
      return parsed;
    } catch (error) {
      throw parseSubscriptionError(
        error,
        "Failed to fetch subscription status.",
      );
    }
  };

export const upgradeToStarter =
  async (): Promise<SubscriptionUpgradeResponse> => {
    try {
      const response = await subscriptionApi.post<unknown>(
        "/subscription/upgrade/starter",
      );
      const parsed = parseSubscriptionResponse<SubscriptionUpgradeResponse>(
        response.data,
        "Failed to upgrade to Starter.",
      );
      console.log("[UPGRADE API RESPONSE]", {
        endpoint: "/subscription/upgrade/starter",
        role: parsed.role,
        message: parsed.message ?? null,
      });
      return parsed;
    } catch (error) {
      throw parseSubscriptionError(error, "Failed to upgrade to Starter.");
    }
  };

export const upgradeToPro = async (): Promise<SubscriptionUpgradeResponse> => {
  try {
    const response = await subscriptionApi.post<unknown>(
      "/subscription/upgrade/pro",
    );
    const parsed = parseSubscriptionResponse<SubscriptionUpgradeResponse>(
      response.data,
      "Failed to upgrade to Pro.",
    );
    console.log("[UPGRADE API RESPONSE]", {
      endpoint: "/subscription/upgrade/pro",
      role: parsed.role,
      message: parsed.message ?? null,
    });
    return parsed;
  } catch (error) {
    throw parseSubscriptionError(error, "Failed to upgrade to Pro.");
  }
};
