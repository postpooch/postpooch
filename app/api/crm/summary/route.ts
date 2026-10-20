import { crmError, crmJson, crmTenant } from "@/lib/crm/http";
export async function GET() { try { return crmJson({ data: await (await crmTenant()).summary() }); } catch (error) { return crmError(error, "Unable to load the CRM dashboard."); } }
