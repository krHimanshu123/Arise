import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "5");

  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: q (search query)" },
      { status: 400 }
    );
  }

  try {
    // For demo purposes, we'll simulate web search results
    // In production, you could integrate with:
    // - Google Custom Search API
    // - Bing Search API
    // - SerpAPI
    // - DuckDuckGo API
    
    const simulatedResults = generateSimulatedResults(query, limit);
    
    return NextResponse.json({
      query,
      results: simulatedResults,
      total_results: simulatedResults.length,
      search_time: "0.15 seconds",
      timestamp: new Date().toISOString(),
      note: "This is a simulated search. Integrate with a real search API for production use."
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

function generateSimulatedResults(query, limit) {
  const queryLower = query.toLowerCase();
  
  // Simulate different types of results based on query keywords
  const results = [];
  
  if (queryLower.includes('weather')) {
    results.push({
      title: "Weather.com - National and Local Weather Radar",
      url: "https://weather.com",
      description: "Get the latest weather information, forecasts, and radar maps for your location.",
      type: "weather"
    });
  }
  
  if (queryLower.includes('github') || queryLower.includes('code')) {
    results.push({
      title: "GitHub - Where the world builds software",
      url: "https://github.com",
      description: "GitHub is where over 100 million developers shape the future of software, together.",
      type: "development"
    });
  }
  
  if (queryLower.includes('javascript') || queryLower.includes('programming')) {
    results.push({
      title: "MDN Web Docs - JavaScript",
      url: "https://developer.mozilla.org/docs/Web/JavaScript",
      description: "JavaScript documentation and tutorials for web developers.",
      type: "documentation"
    });
  }
  
  if (queryLower.includes('news')) {
    results.push({
      title: "Latest News and Headlines",
      url: "https://news.example.com",
      description: "Stay up to date with the latest news and current events from around the world.",
      type: "news"
    });
  }
  
  // Add generic results to fill up to the limit
  const genericResults = [
    {
      title: `Search results for "${query}"`,
      url: `https://search.example.com/search?q=${encodeURIComponent(query)}`,
      description: `Comprehensive search results and information about ${query}.`,
      type: "general"
    },
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
      description: `Learn more about ${query} on Wikipedia, the free encyclopedia.`,
      type: "encyclopedia"
    },
    {
      title: `${query} - YouTube`,
      url: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
      description: `Watch videos and tutorials about ${query} on YouTube.`,
      type: "video"
    },
    {
      title: `${query} - Stack Overflow`,
      url: `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
      description: `Find programming questions and answers related to ${query}.`,
      type: "qa"
    },
    {
      title: `${query} - Reddit`,
      url: `https://reddit.com/search?q=${encodeURIComponent(query)}`,
      description: `Community discussions and content about ${query} on Reddit.`,
      type: "social"
    }
  ];
  
  // Combine specific and generic results
  const allResults = [...results, ...genericResults];
  
  // Add metadata to each result
  return allResults.slice(0, limit).map((result, index) => ({
    ...result,
    rank: index + 1,
    snippet: result.description,
    displayed_url: result.url,
    cached_url: `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(result.url)}`,
    last_updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
}