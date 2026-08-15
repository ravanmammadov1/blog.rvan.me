/**
 * Headless WordPress API Client module for rvan.me
 * Replaces Sanity Client with high-performance WPGraphQL API integration
 */

const WORDPRESS_API_URL =
  (import.meta.env && import.meta.env.VITE_WORDPRESS_API_URL) ||
  "https://cms.rvan.me/graphql";

export interface WpGraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; locations?: any[]; path?: string[] }>;
}

/**
 * Execute a GraphQL query against the Headless WordPress API
 */
export async function wpFetch<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T | null> {
  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      console.warn(`[WPGraphQL] HTTP error ${response.status} from ${WORDPRESS_API_URL}`);
      return null;
    }

    const json: WpGraphQLResponse<T> = await response.json();

    if (json.errors && json.errors.length > 0) {
      console.error("[WPGraphQL] GraphQL Query Errors:", json.errors);
    }

    return json.data || null;
  } catch (error) {
    console.error("[WPGraphQL] Network error fetching from WordPress:", error);
    return null;
  }
}

/**
 * Helper to normalize WordPress Media Item node to an absolute image URL
 */
export function getWpImage(mediaNode?: any): string | null {
  if (!mediaNode) return null;
  if (typeof mediaNode === "string") return mediaNode;
  if (mediaNode.sourceUrl) return mediaNode.sourceUrl;
  if (mediaNode.mediaDetails?.sizes) {
    const sizes = mediaNode.mediaDetails.sizes;
    return sizes.large?.sourceUrl || sizes.medium_large?.sourceUrl || mediaNode.sourceUrl;
  }
  if (mediaNode.node?.sourceUrl) return mediaNode.node.sourceUrl;
  return null;
}
