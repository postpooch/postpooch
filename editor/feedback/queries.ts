import { generateUUID } from "@/editor/utils/id";
import type { FeedbackEntry, SubmitFeedbackInput } from "./types";

/** Local stub — OpenCut Classic used Postgres; postpooch keeps feedback client-side for now. */
export async function submitFeedback({
	message,
}: SubmitFeedbackInput): Promise<FeedbackEntry> {
	return {
		id: generateUUID(),
		message,
		createdAt: new Date().toISOString(),
	};
}
