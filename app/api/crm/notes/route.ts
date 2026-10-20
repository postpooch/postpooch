import { noteInput } from "@/lib/crm/input";
import { crmError, crmJson, crmListJson, crmTenant, parsePage, readJson } from "@/lib/crm/http";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams; const page = parsePage(params); const repository = await crmTenant();
    const result = await repository.listNotes({ ...page, filters: { contactId: params.get("contactId"), propertyId: params.get("propertyId"), transactionId: params.get("transactionId") } });
    return crmListJson(result.data, page, result.total);
  } catch (error) { return crmError(error, "Unable to load notes right now."); }
}
export async function POST(request: Request) { try { return crmJson({ data: await (await crmTenant()).createNote(await readJson(request, noteInput)) }, 201); } catch (error) { return crmError(error, "Unable to create that note."); } }

