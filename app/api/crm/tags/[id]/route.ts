import { tagPatchInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson, validUuid } from "@/lib/crm/http";
import { CrmAccessError } from "@/lib/crm/repository";
async function idFrom(context: { params: Promise<{ id: string }> }) { const { id } = await context.params; if (!validUuid(id)) throw new CrmAccessError("Tag not found."); return id; }
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { try { return crmJson({ data: await (await crmTenant()).updateTag(await idFrom(context), await readJson(request, tagPatchInput)) }); } catch (error) { return crmError(error, "Unable to update that tag."); } }
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { try { await (await crmTenant()).deleteTag(await idFrom(context)); return new Response(null, { status: 204 }); } catch (error) { return crmError(error, "Unable to delete that tag."); } }

