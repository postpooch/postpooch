"use client";

import { useCallback, useEffect, useState } from "react";

import { unwrapCrmEnvelope, type CrmListMeta } from "@/lib/crm/envelope";

type ApiEnvelope<T> = { data: T; error?: string; meta?: CrmListMeta };

export class CrmApiError extends Error {}

export async function crmFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({ error: "The server returned an invalid response." })) as ApiEnvelope<T>;
  if (!response.ok) throw new CrmApiError(body.error || "Something went wrong.");
  return unwrapCrmEnvelope(body) as T;
}

export function useCrmData<T>(path: string) {
  const [state, setState] = useState<{ path: string | null; data: T | null; error: string | null }>({ path: null, data: null, error: null });
  const load = useCallback(async () => {
    try { setState({ path, data: await crmFetch<T>(path), error: null }); }
    catch (reason) { setState({ path, data: null, error: reason instanceof Error ? reason.message : "Unable to load CRM data." }); }
  }, [path]);
  useEffect(() => {
    let active = true;
    crmFetch<T>(path).then(
      (data) => { if (active) setState({ path, data, error: null }); },
      (reason: unknown) => { if (active) setState({ path, data: null, error: reason instanceof Error ? reason.message : "Unable to load CRM data." }); },
    );
    return () => { active = false; };
  }, [path]);
  return { data: state.path === path ? state.data : null, error: state.path === path ? state.error : null, loading: state.path !== path, reload: load };
}

export function jsonBody(value: unknown): RequestInit {
  return { body: JSON.stringify(value) };
}
