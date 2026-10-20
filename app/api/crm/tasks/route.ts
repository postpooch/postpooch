import { taskInput } from "@/lib/crm/input";
import { crmError, crmJson, crmListJson, crmTenant, parsePage, readJson } from "@/lib/crm/http";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams; const page = parsePage(params); const repository = await crmTenant();
    const result = await repository.listTasks({ ...page, q: params.get("q")?.trim(), filters: {
      status: params.get("status"), priority: params.get("priority"), type: params.get("type"), due: params.get("due"),
      contactId: params.get("contactId"), transactionId: params.get("transactionId"),
    }});
    return crmListJson(result.data, page, result.total);
  } catch (error) { return crmError(error, "Unable to load tasks right now."); }
}
export async function POST(request: Request) { try { return crmJson({ data: await (await crmTenant()).createTask(await readJson(request, taskInput)) }, 201); } catch (error) { return crmError(error, "Unable to create that task."); } }

