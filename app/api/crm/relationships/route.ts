import { relationshipInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson } from "@/lib/crm/http";

export async function POST(request: Request) {
  try {
    return crmJson({ data: await (await crmTenant()).createRelationship(await readJson(request, relationshipInput)) }, 201);
  } catch (error) {
    return crmError(error, "Unable to create that relationship.");
  }
}
