import { partnerInput } from "@/lib/crm/input";
import { crmError, crmJson, crmListJson, crmTenant, parsePage, readJson } from "@/lib/crm/http";
export async function GET(request: Request) { try { const params = new URL(request.url).searchParams; const page = parsePage(params); const result = await (await crmTenant()).listPartners({ ...page, q: params.get("q")?.trim(), filters: { type: params.get("type") } }); return crmListJson(result.data, page, result.total); } catch (error) { return crmError(error, "Unable to load partners right now."); } }
export async function POST(request: Request) { try { return crmJson({ data: await (await crmTenant()).createPartner(await readJson(request, partnerInput)) }, 201); } catch (error) { return crmError(error, "Unable to create that partner."); } }

