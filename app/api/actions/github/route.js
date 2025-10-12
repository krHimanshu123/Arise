import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing required parameters: owner and repo" },
      { status: 400 }
    );
  }

  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Arise-Chat-Bot'
    };

    // Add authorization if token is available
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();

    // Extract key information
    const stats = {
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      open_issues_count: data.open_issues_count,
      language: data.language,
      created_at: data.created_at,
      updated_at: data.updated_at,
      html_url: data.html_url,
      topics: data.topics || [],
      license: data.license?.name || null,
      size: data.size,
      default_branch: data.default_branch,
      archived: data.archived,
      disabled: data.disabled,
      private: data.private
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("GitHub API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repository data" },
      { status: 500 }
    );
  }
}