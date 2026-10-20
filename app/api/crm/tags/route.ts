import { tagInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson } from "@/lib/crm/http";
export async function GET() { try { return crmJson({ data: await (await crmTenant()).listTags() }); } catch (error) { return crmError(error, "Unable to load tags right now."); } }
export async function POST(request: Request) { try { return crmJson({ data: await (await crmTenant()).createTag(await readJson(request, tagInput)) }, 201); } catch (error) { return crmError(error, "Unable to create that tag."); } }

