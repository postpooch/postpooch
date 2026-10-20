export type CrmListMeta = {
  page: number;
  pageSize: number;
  total: number;
};

type CrmEnvelope = {
  data?: unknown;
  error?: string;
  meta?: CrmListMeta;
};

/**
 * CRM success bodies are `{ data }`. Paginated list routes also send sibling
 * `meta`. Views typed as `CrmListResponse` need `{ data, meta }` after unwrap.
 */
export function unwrapCrmEnvelope(body: CrmEnvelope): unknown {
  if (body.meta) {
    return {
      data: Array.isArray(body.data) ? body.data : [],
      meta: body.meta,
    };
  }
  return body.data;
}
