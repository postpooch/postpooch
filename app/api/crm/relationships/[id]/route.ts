import { crmError, crmTenant, validUuid } from "@/lib/crm/http";
import { CrmAccessError } from "@/lib/crm/repository";

async function idFrom(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!validUuid(id)) throw new CrmAccessError("Relationship not found.");
  return id;
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await (await crmTenant()).deleteRelationship(await idFrom(context));
    return new Response(null, { status: 204 });
  } catch (error) {
    return crmError(error, "Unable to delete that relationship.");
  }
}
