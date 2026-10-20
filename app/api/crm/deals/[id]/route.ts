import { dealPatchInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson, validUuid } from "@/lib/crm/http";
import { CrmAccessError } from "@/lib/crm/repository";

async function idFrom(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!validUuid(id)) throw new CrmAccessError("Deal not found.");
  return id;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    return crmJson({ data: await (await crmTenant()).getDeal(await idFrom(context)) });
  } catch (error) {
    return crmError(error, "Unable to load that deal.");
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    return crmJson({
      data: await (await crmTenant()).updateDeal(await idFrom(context), await readJson(request, dealPatchInput)),
    });
  } catch (error) {
    return crmError(error, "Unable to update that deal.");
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await (await crmTenant()).deleteDeal(await idFrom(context));
    return new Response(null, { status: 204 });
  } catch (error) {
    return crmError(error, "Unable to delete that deal.");
  }
}
