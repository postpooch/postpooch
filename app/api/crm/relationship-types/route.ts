import { relationshipTypeInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson } from "@/lib/crm/http";

export async function GET() {
  try {
    return crmJson({ data: await (await crmTenant()).listRelationshipTypes() });
  } catch (error) {
    return crmError(error, "Unable to load relationship types right now.");
  }
}

export async function POST(request: Request) {
  try {
    return crmJson({ data: await (await crmTenant()).createRelationshipType(await readJson(request, relationshipTypeInput)) }, 201);
  } catch (error) {
    return crmError(error, "Unable to create that relationship type.");
  }
}
