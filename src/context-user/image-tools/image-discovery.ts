import { PostingError } from "../../posting/errors";
import type { ContextUserEnvironment } from "../environment";

export type ImageDiscoveryInput = {
  query: string;
  orientation?: "landscape" | "portrait" | "square";
  maxPhotos: number;
};

export type DiscoveredImage = {
  provider: string;
  providerAssetId: string;
  providerPageUrl: string;
  creatorName: string;
  creatorUrl: string | null;
  downloadUrl: string;
  downloadAllowedHosts: readonly string[];
  width: number;
  height: number;
  description: string;
};

export interface ImageDiscoveryService {
  findImages(input: ImageDiscoveryInput): Promise<DiscoveredImage[]>;
}

type CurrentProviderResponse = {
  hits?: Array<{
    id: number;
    pageURL?: string;
    tags?: string;
    largeImageURL?: string;
    webformatURL?: string;
    imageWidth?: number;
    imageHeight?: number;
    webformatWidth?: number;
    webformatHeight?: number;
    user_id?: number;
    user?: string;
  }>;
};

const CURRENT_PAGE_HOSTS = ["pixabay.com", "www.pixabay.com"] as const;
const CURRENT_IMAGE_HOSTS = ["pixabay.com", "cdn.pixabay.com"] as const;

function validatedProviderUrl(value: string, allowedHosts: readonly string[]): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname.toLowerCase())) {
    throw new PostingError("Image provider returned an untrusted URL", false);
  }
  return url.toString();
}

function creatorUrl(user: string | undefined, userId: number | undefined): string | null {
  if (!user || !userId) return null;
  return `https://pixabay.com/users/${encodeURIComponent(user)}-${userId}/`;
}

async function findWithCurrentSources(input: {
  request: ImageDiscoveryInput;
  apiKey: string;
  fetcher: typeof fetch;
}): Promise<DiscoveredImage[]> {
  const requestedLimit = Math.min(10, Math.max(1, input.request.maxPhotos));
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", input.apiKey);
  url.searchParams.set("q", input.request.query.slice(0, 100));
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("per_page", String(Math.max(3, requestedLimit)));
  if (input.request.orientation === "landscape") url.searchParams.set("orientation", "horizontal");
  if (input.request.orientation === "portrait") url.searchParams.set("orientation", "vertical");

  let response: Response;
  try {
    response = await input.fetcher(url, { signal: AbortSignal.timeout(20_000) });
  } catch (error) {
    throw new PostingError("Image discovery request failed", true, { cause: error });
  }
  if (!response.ok) {
    const retryable = response.status === 408 || response.status === 425 ||
      response.status === 429 || response.status >= 500;
    throw new PostingError(`Image discovery returned HTTP ${response.status}`, retryable);
  }

  const body = await response.json() as CurrentProviderResponse;
  return (body.hits ?? []).slice(0, requestedLimit).flatMap((image): DiscoveredImage[] => {
    const downloadUrl = image.largeImageURL ?? image.webformatURL;
    if (!downloadUrl || !image.pageURL) return [];
    const contributor = image.user?.trim() || "Image contributor";
    return [{
      provider: "pixabay",
      providerAssetId: String(image.id),
      providerPageUrl: validatedProviderUrl(image.pageURL, CURRENT_PAGE_HOSTS),
      creatorName: contributor,
      creatorUrl: creatorUrl(image.user, image.user_id),
      downloadUrl: validatedProviderUrl(downloadUrl, CURRENT_IMAGE_HOSTS),
      downloadAllowedHosts: CURRENT_IMAGE_HOSTS,
      width: image.imageWidth ?? image.webformatWidth ?? 1,
      height: image.imageHeight ?? image.webformatHeight ?? 1,
      description: image.tags?.trim() || `Image by ${contributor}`,
    }];
  });
}

/**
 * The application-facing image discovery boundary. Provider selection,
 * multi-source ranking, reuse checks, and future filtering belong inside this
 * factory/service rather than in the Creative Agent or workflow.
 */
export function createImageDiscoveryService(
  environment: ContextUserEnvironment,
  fetcher: typeof fetch = fetch,
): ImageDiscoveryService {
  const currentApiKey = environment.imageDiscoveryCredentials.pixabay;
  if (!currentApiKey) {
    throw new PostingError("Image discovery is not configured", false);
  }
  return {
    findImages: (request) => findWithCurrentSources({
      request,
      apiKey: currentApiKey,
      fetcher,
    }),
  };
}
