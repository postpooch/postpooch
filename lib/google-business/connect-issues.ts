export const GOOGLE_BUSINESS_CONNECT_ISSUES = [
  "missing_permissions",
  "no_locations",
  "cancelled",
  "setup_incomplete",
  "account_unavailable",
  "plan_required",
  "rate_limited",
  "save_failed",
  "start_failed",
  "needs_attention",
  "unavailable",
] as const;

export type GoogleBusinessConnectIssue = (typeof GOOGLE_BUSINESS_CONNECT_ISSUES)[number];

export type GoogleBusinessConnectNotice = {
  issue: GoogleBusinessConnectIssue;
  title: string;
  detail: string;
};

const ISSUE_SET = new Set<string>(GOOGLE_BUSINESS_CONNECT_ISSUES);

const COPY: Record<GoogleBusinessConnectIssue, Omit<GoogleBusinessConnectNotice, "issue">> = {
  missing_permissions: {
    title: "A permission is still needed",
    detail:
      "Google needs “Manage your Business Profile” turned on. Connect again, and check every box on the Google screen.",
  },
  no_locations: {
    title: "Add your business on Google",
    detail:
      "This Google account doesn’t have a listing yet. Continue on Google to add or claim it, then we’ll finish connecting here.",
  },
  cancelled: {
    title: "Connection wasn’t finished",
    detail: "Google authorization was closed before it completed. You can try again whenever you’re ready.",
  },
  setup_incomplete: {
    title: "Finish setting up PostPooch first",
    detail: "Your account still needs a little setup before Google Business can be connected.",
  },
  account_unavailable: {
    title: "This Google account can’t be used",
    detail: "That account isn’t available to PostPooch. Try the Google account that manages the listing.",
  },
  plan_required: {
    title: "This connection isn’t available right now",
    detail: "Google Business isn’t included on the current plan. Try again later, or check your PostPooch plan.",
  },
  rate_limited: {
    title: "Google is asking us to wait",
    detail: "Too many attempts happened just now. Wait a moment, then try again.",
  },
  save_failed: {
    title: "Couldn’t save the connection",
    detail: "Google authorized the account, but PostPooch couldn’t finish saving it. Try connecting again.",
  },
  start_failed: {
    title: "Couldn’t start the connection",
    detail: "We couldn’t open Google’s secure sign-in. Check your internet connection, then try again.",
  },
  needs_attention: {
    title: "Google needs a little more from you",
    detail:
      "The connection didn’t finish. Use the Google account that manages this business, and allow every permission on the next screen.",
  },
  unavailable: {
    title: "Google Business wasn’t connected",
    detail: "Something went wrong during authorization. Try again in a moment.",
  },
};

export function googleBusinessConnectNotice(issue: GoogleBusinessConnectIssue): GoogleBusinessConnectNotice {
  return { issue, ...COPY[issue] };
}

export function firstSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseConnectIssue(value: string | null | undefined): GoogleBusinessConnectIssue | null {
  const code = value?.trim();
  if (!code) return null;
  if (code === "1" || code === "true") return "unavailable";
  return ISSUE_SET.has(code) ? (code as GoogleBusinessConnectIssue) : "unavailable";
}

export const GOOGLE_BUSINESS_ADD_LOCATION_URL = "https://business.google.com/add";

export const GOOGLE_BUSINESS_ADD_RESUME_KEY = "postpooch.google-business.add-location-resume";

export function googleBusinessConnectFailurePath(issue: GoogleBusinessConnectIssue) {
  return `/dashboard/google_business?connect_issue=${issue}`;
}

export function issueFromCallbackParams(params: {
  get(name: string): string | null;
}): GoogleBusinessConnectIssue {
  const error = params.get("error")?.trim().toLowerCase() ?? "";
  const message = params.get("error_message")?.toLowerCase() ?? "";
  const userFixable = params.get("is_user_fixable") === "true";

  if (
    error === "missing_google_permissions" ||
    error === "insufficient_permissions" ||
    error === "access_restricted"
  ) {
    return "missing_permissions";
  }

  if (error === "no_google_locations" || error === "no_locations" || error === "no_gmb_locations") {
    return "no_locations";
  }

  if (
    error === "access_denied" ||
    error === "cancelled" ||
    error === "canceled" ||
    error === "user_cancelled" ||
    error === "user_canceled"
  ) {
    return "cancelled";
  }

  if (error === "server_error" || error === "temporarily_unavailable") return "unavailable";
  if (message.includes("manage your business profile") || message.includes("permission")) {
    return "missing_permissions";
  }
  if (message.includes("location")) return "no_locations";
  if (userFixable) return "needs_attention";
  return "unavailable";
}

export function issueFromStartResponse(status: number, error?: string | null): GoogleBusinessConnectIssue {
  const message = error?.toLowerCase() ?? "";
  if (status === 401) return "unavailable";
  if (status === 409 || message.includes("finish account setup") || message.includes("profile is required")) {
    return "setup_incomplete";
  }
  if (status === 402 || status === 403) return "plan_required";
  if (status === 429) return "rate_limited";
  return "start_failed";
}

export function issueFromCompleteResponse(status: number, error?: string | null): GoogleBusinessConnectIssue {
  const message = error?.toLowerCase() ?? "";
  if (status === 409 || message.includes("finish account setup") || message.includes("profile is required")) {
    return "setup_incomplete";
  }
  if (status === 402) return "plan_required";
  if (status === 403) return message.includes("profile") ? "setup_incomplete" : "plan_required";
  if (status === 429) return "rate_limited";
  if (status === 404 || message.includes("not available")) return "account_unavailable";
  if (message.includes("location")) return "no_locations";
  return "save_failed";
}
