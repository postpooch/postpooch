import { requireAuthenticatedUser } from "@/lib/auth/token_check";
import { cityLabel, searchCities } from "@/lib/social-media/cities";
import { socialError, socialJson } from "@/lib/social-media/http";

const MAX_QUERY_LENGTH = 100;
const MAX_RESULTS = 10;

export async function GET(request: Request) {
  try {
    await requireAuthenticatedUser();

    const query = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);
    if (!query) {
      return socialJson({ data: [] });
    }

    const cities = await searchCities(query, MAX_RESULTS);
    return socialJson({
      data: cities.map((city) => ({ ...city, label: cityLabel(city) })),
    });
  } catch (error) {
    return socialError(error, "Unable to search cities right now.");
  }
}
