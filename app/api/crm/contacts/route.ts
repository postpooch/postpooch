import { contactInput } from "@/lib/crm/input";
import { crmError, crmJson, crmListJson, crmTenant, parsePage, readJson } from "@/lib/crm/http";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const page = parsePage(params);
    const repository = await crmTenant();
    const result = await repository.listContacts({ ...page, q: params.get("q")?.trim(), filters: {
      status: params.get("status"), priority: params.get("priority"), type: params.get("type"),
      source: params.get("source"), tagId: params.get("tagId"), stageId: params.get("stageId"),
    }});
    return crmListJson(result.data, page, result.total);
  } catch (error) { return crmError(error, "Unable to load contacts right now."); }
}

export async function POST(request: Request) {
  try {
    const input = await readJson(request, contactInput);
    return crmJson({ data: await (await crmTenant()).createContact(input) }, 201);
  } catch (error) { return crmError(error, "Unable to create that contact."); }
}

