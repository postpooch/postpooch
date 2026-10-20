import { dealStageInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson } from "@/lib/crm/http";
import { CrmValidationError } from "@/lib/crm/repository";
import { CRM_DEAL_CLIENT_TYPES } from "@/lib/crm/constants";

export async function GET(request: Request) {
  try {
    const clientType = new URL(request.url).searchParams.get("clientType");
    if (clientType && !CRM_DEAL_CLIENT_TYPES.includes(clientType as (typeof CRM_DEAL_CLIENT_TYPES)[number])) {
      throw new CrmValidationError("clientType must be buyer or seller.");
    }
    return crmJson({
      data: await (await crmTenant()).listDealStages(
        clientType ? (clientType as "buyer" | "seller") : undefined,
      ),
    });
  } catch (error) {
    return crmError(error, "Unable to load deal stages.");
  }
}

export async function POST(request: Request) {
  try {
    return crmJson({ data: await (await crmTenant()).createDealStage(await readJson(request, dealStageInput)) }, 201);
  } catch (error) {
    return crmError(error, "Unable to create that deal stage.");
  }
}
