import { describe, expect, it } from "vitest";

import { unwrapCrmEnvelope } from "@/lib/crm/envelope";

describe("unwrapCrmEnvelope", () => {
  it("returns the resource for a single-record envelope", () => {
    const contact = { id: "1", firstName: "Taylor" };
    expect(unwrapCrmEnvelope({ data: contact })).toEqual(contact);
  });

  it("returns the array for a non-paginated collection", () => {
    const tags = [{ id: "1", name: "VIP" }];
    expect(unwrapCrmEnvelope({ data: tags })).toEqual(tags);
  });

  it("rebuilds CrmListResponse when pagination meta is present", () => {
    const contacts = [{ id: "1", firstName: "Taylor" }];
    const meta = { page: 1, pageSize: 100, total: 1 };
    expect(unwrapCrmEnvelope({ data: contacts, meta })).toEqual({ data: contacts, meta });
  });

  it("uses an empty list when paginated data is missing", () => {
    const meta = { page: 1, pageSize: 100, total: 0 };
    expect(unwrapCrmEnvelope({ meta })).toEqual({ data: [], meta });
  });

  it("lets list views read data.data.length without throwing", () => {
    const data = unwrapCrmEnvelope({
      data: [],
      meta: { page: 1, pageSize: 100, total: 0 },
    }) as { data: unknown[] };
    expect(data?.data.length).toBe(0);
  });
});
