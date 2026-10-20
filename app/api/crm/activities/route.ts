import { crmError, crmJson, crmTenant } from "@/lib/crm/http";
export async function GET(request: Request) { try { const limit = Number.parseInt(new URL(request.url).searchParams.get("limit") ?? "20", 10); return crmJson({ data: await (await crmTenant()).listActivities(limit) }); } catch (error) { return crmError(error, "Unable to load CRM activity."); } }

