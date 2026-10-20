import { transactionInput } from "@/lib/crm/input";
import { crmError, crmJson, crmListJson, crmTenant, parsePage, readJson } from "@/lib/crm/http";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams; const page = parsePage(params); const repository = await crmTenant();
    const result = await repository.listTransactions({ ...page, q: params.get("q")?.trim(), filters: {
      status: params.get("status"), side: params.get("side"),
      contactId: params.get("contactId"), propertyId: params.get("propertyId"),
    }});
    return crmListJson(result.data, page, result.total);
  } catch (error) { return crmError(error, "Unable to load transactions right now."); }
}
export async function POST(request: Request) { try { return crmJson({ data: await (await crmTenant()).createTransaction(await readJson(request, transactionInput)) }, 201); } catch (error) { return crmError(error, "Unable to create that transaction."); } }

