import { stageInput } from "@/lib/crm/input";
import { crmError, crmJson, crmTenant, readJson } from "@/lib/crm/http";
export async function GET() { try { return crmJson({ data: await (await crmTenant()).listStages() }); } catch (error) { return crmError(error, "Unable to load contact stages."); } }
export async function POST(request: Request) { try { return crmJson({ data: await (await crmTenant()).createStage(await readJson(request, stageInput)) }, 201); } catch (error) { return crmError(error, "Unable to create that contact stage."); } }
