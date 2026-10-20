import { contactPatchInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson, validUuid } from "@/lib/crm/http";

async function idFrom(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!validUuid(id)) throw new (await import("@/lib/crm/repository")).CrmAccessError("Contact not found.");
  return id;
}
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try { return crmJson({ data: await (await crmTenant()).getContact(await idFrom(context)) }); }
  catch (error) { return crmError(error, "Unable to load that contact."); }
}
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try { return crmJson({ data: await (await crmTenant()).updateContact(await idFrom(context), await readJson(request, contactPatchInput)) }); }
  catch (error) { return crmError(error, "Unable to update that contact."); }
}
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try { await (await crmTenant()).deleteContact(await idFrom(context)); return new Response(null, { status: 204 }); }
  catch (error) { return crmError(error, "Unable to delete that contact."); }
}

