import { dealInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson } from "@/lib/crm/http";
import { CrmValidationError } from "@/lib/crm/repository";
import { CRM_DEAL_CLIENT_TYPES } from "@/lib/crm/constants";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const clientType = params.get("clientType") ?? "buyer";
    if (!CRM_DEAL_CLIENT_TYPES.includes(clientType as (typeof CRM_DEAL_CLIENT_TYPES)[number])) {
      throw new CrmValidationError("clientType must be buyer or seller.");
    }
    const repository = await crmTenant();
    return crmJson({ data: await repository.getDealBoard(clientType as "buyer" | "seller") });
  } catch (error) {
    return crmError(error, "Unable to load deals right now.");
  }
}

export async function POST(request: Request) {
  try {
    return crmJson({ data: await (await crmTenant()).createDeal(await readJson(request, dealInput)) }, 201);
  } catch (error) {
    return crmError(error, "Unable to create that deal.");
  }
}
