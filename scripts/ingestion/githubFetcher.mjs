/**
 * GitHub API Ingestion Module
 * Fetches trending and high-impact open-source repositories for design, AI, and developer tools.
 */

const TARGET_TOPICS = ['design-system', 'ui-library', 'ai-tools', 'developer-tools', 'figma-plugin'];

export async function fetchGitHubProjects(githubToken = process.env.GITHUB_TOKEN) {
  console.log('[GitHub Ingest] Fetching trending GitHub repositories...');
  const headers = {
    'User-Agent': 'KnowledgePlatformIngestion/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  const items = [];

  for (const topic of TARGET_TOPICS) {
    try {
      const url = `https://api.github.com/search/repositories?q=topic:${topic}+stars:>100&sort=updated&order=desc&per_page=5`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.warn(`[GitHub Ingest Warning] Topic ${topic} returned status ${res.status}`);
        continue;
      }
      const data = await res.json();
      const repos = data.items || [];

      for (const repo of repos) {
        items.push({
          rawTitle: `${repo.owner?.login}/${repo.name}`,
          rawLink: repo.html_url,
          rawSnippet: repo.description || 'Open source developer tool on GitHub.',
          publishedAt: repo.pushed_at || repo.updated_at || new Date().toISOString(),
          sourceName: 'GitHub Trending',
          defaultContentType: 'githubProject',
          githubData: {
            repoUrl: repo.html_url,
            starsCount: repo.stargazers_count,
            primaryLanguage: repo.language || 'TypeScript',
            license: repo.license?.spdx_id || 'MIT'
          }
        });
      }
    } catch (err) {
      console.warn(`[GitHub Ingest Warning] Topic search failed for ${topic}: ${err.message}`);
    }
  }

  console.log(`[GitHub Ingest] Successfully fetched ${items.length} repositories.`);
  return items;
}
