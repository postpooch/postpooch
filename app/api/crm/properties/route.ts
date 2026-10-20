import { propertyInput } from "@/lib/crm/input";
import { crmError, crmJson, crmListJson, crmTenant, parsePage, readJson } from "@/lib/crm/http";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams; const page = parsePage(params); const repository = await crmTenant();
    const result = await repository.listProperties({ ...page, q: params.get("q")?.trim(), filters: { status: params.get("status"), type: params.get("type") } });
    return crmListJson(result.data, page, result.total);
  } catch (error) { return crmError(error, "Unable to load properties right now."); }
}
export async function POST(request: Request) {
  try { return crmJson({ data: await (await crmTenant()).createProperty(await readJson(request, propertyInput)) }, 201); }
  catch (error) { return crmError(error, "Unable to create that property."); }
}

