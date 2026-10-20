import { stagePatchInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson, validUuid } from "@/lib/crm/http";
import { CrmAccessError } from "@/lib/crm/repository";
async function idFrom(context: { params: Promise<{ id: string }> }) { const { id } = await context.params; if (!validUuid(id)) throw new CrmAccessError("Contact stage not found."); return id; }
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { try { return crmJson({ data: await (await crmTenant()).updateStage(await idFrom(context), await readJson(request, stagePatchInput)) }); } catch (error) { return crmError(error, "Unable to update that contact stage."); } }
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { try { await (await crmTenant()).deleteStage(await idFrom(context)); return new Response(null, { status: 204 }); } catch (error) { return crmError(error, "Unable to delete that contact stage."); } }
