/**
 * Action dispatcher for the AI agent
 * Routes actions to appropriate server endpoints
 */

export async function runAction(action, params) {
  try {
    switch (action) {
      case "fetch_github_stats":
        return await fetchGitHubStats(params);
      
      case "fetch_weather":
        return await fetchWeather(params);
      
      case "create_todo":
        return await createTodo(params);
      
      case "send_email":
        return await sendEmail(params);
      
      case "search_web":
        return await searchWeb(params);
      
      case "get_time":
        return await getCurrentTime(params);
      
      case "calculate":
        return await calculate(params);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`Action ${action} failed:`, error);
    throw error;
  }
}

// GitHub API integration
async function fetchGitHubStats(params) {
  const { owner, repo } = params;
  
  if (!owner || !repo) {
    throw new Error("GitHub action requires 'owner' and 'repo' parameters");
  }

  const response = await fetch(`/api/actions/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${error}`);
  }
  
  return await response.json();
}

// Weather API integration
async function fetchWeather(params) {
  const { location, q } = params;
  const query = location || q;
  
  if (!query) {
    throw new Error("Weather action requires 'location' or 'q' parameter");
  }

  const response = await fetch(`/api/actions/weather?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Weather API error: ${error}`);
  }
  
  return await response.json();
}

// Todo management
async function createTodo(params) {
  const { title, description, priority } = params;
  
  if (!title) {
    throw new Error("Todo action requires 'title' parameter");
  }

  const response = await fetch('/api/actions/todo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Todo API error: ${error}`);
  }
  
  return await response.json();
}

// Email sending (simulation)
async function sendEmail(params) {
  const { to, subject, body } = params;
  
  if (!to || !subject) {
    throw new Error("Email action requires 'to' and 'subject' parameters");
  }

  const response = await fetch('/api/actions/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email API error: ${error}`);
  }
  
  return await response.json();
}

// Web search
async function searchWeb(params) {
  const { query, limit = 5 } = params;
  
  if (!query) {
    throw new Error("Search action requires 'query' parameter");
  }

  const response = await fetch(`/api/actions/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Search API error: ${error}`);
  }
  
  return await response.json();
}

// Get current time
async function getCurrentTime(params) {
  const { timezone = 'local' } = params;
  
  const response = await fetch(`/api/actions/time?timezone=${encodeURIComponent(timezone)}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Time API error: ${error}`);
  }
  
  return await response.json();
}

// Mathematical calculations
async function calculate(params) {
  const { expression, operation, a, b } = params;
  
  if (!expression && (!operation || a === undefined || b === undefined)) {
    throw new Error("Calculate action requires 'expression' or 'operation', 'a', and 'b' parameters");
  }

  const response = await fetch('/api/actions/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression, operation, a, b }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Calculate API error: ${error}`);
  }
  
  return await response.json();
}