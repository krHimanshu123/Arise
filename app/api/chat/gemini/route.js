import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, maxTokens = 2048, temperature = 0.7 } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Create a simple prompt for Gemini 2.5 Pro
    const systemInstruction = `You are an advanced AI Career Assistant powered by Gemini 2.5 Pro with agent capabilities. You specialize in helping users with career advice, resume optimization, interview preparation, job search strategies, and professional development.

When you want to perform an action/task, respond with a JSON object in this EXACT format:
{"type":"action","action":"ACTION_NAME","params":{"key":"value"}}

Available actions:
- fetch_github_stats: Get GitHub repository statistics
- fetch_weather: Get weather information for a location  
- create_todo: Create a new todo item
- send_email: Send an email (simulation)
- search_web: Search the web for information
- get_time: Get current time
- calculate: Perform mathematical calculations

For normal conversation, respond naturally without JSON formatting. Focus on providing helpful career guidance, professional advice, and actionable insights. Be conversational, helpful, and professional.`;

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    const userInput = latestMessage?.text || "Hello";
    
    // Create prompt
    const prompt = `${systemInstruction}\n\nUser: ${userInput}\n\nAssistant:`;

    // Gemini 2.5 Pro specific API endpoints - try multiple versions for compatibility
    const gemini25ProEndpoints = [
      // Latest experimental endpoints for Gemini 2.5 Pro
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        name: "gemini-2.5-flash (v1beta)"
      },
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
        name: "gemini-2.0-flash-exp (v1beta)"
      },
      {
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        name: "gemini-2.5-flash (v1)"
      },
      // Fallback to latest stable models
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${process.env.GEMINI_API_KEY}`,
        name: "gemini-1.5-pro-002 (v1beta)"
      },
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${process.env.GEMINI_API_KEY}`,
        name: "gemini-1.5-flash-002 (v1beta)"
      },
      {
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        name: "gemini-1.5-pro (v1)"
      }
    ];

    let successResponse;
    let lastError;

    // Try each endpoint until one works
    for (const endpoint of gemini25ProEndpoints) {
      try {
        console.log(`🔄 Trying Gemini 2.5 Pro endpoint: ${endpoint.name}`);
        
        const apiResponse = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: maxTokens,
              candidateCount: 1
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH", 
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        });

        if (apiResponse.ok) {
          console.log(`✅ Gemini 2.5 Pro Success with: ${endpoint.name}`);
          successResponse = apiResponse;
          break;
        } else {
          const errorText = await apiResponse.text();
          console.log(`❌ Failed ${endpoint.name}: ${apiResponse.status} - ${errorText}`);
          lastError = `${endpoint.name}: ${apiResponse.status} - ${errorText}`;
          continue;
        }
      } catch (error) {
        console.log(`❌ Error with ${endpoint.name}:`, error.message);
        lastError = `${endpoint.name}: ${error.message}`;
        continue;
      }
    }

    if (!successResponse || !successResponse.ok) {
      console.error("All Gemini 2.5 Pro endpoints failed. Last error:", lastError);
      return NextResponse.json(
        { 
          error: "Gemini 2.5 Pro API endpoints failed",
          details: lastError,
          suggestion: "Please verify your Gemini 2.5 Pro API key is valid and has the correct permissions"
        },
        { status: 400 }
      );
    }

    const data = await successResponse.json();
    
    // Handle potential safety filtering or other response issues
    if (!data.candidates || data.candidates.length === 0) {
      console.log("No candidates returned:", data);
      return NextResponse.json({
        output: "I apologize, but I couldn't generate a response due to safety filters or API limitations. Please try rephrasing your question.",
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: 0,
          total_tokens: prompt.length
        }
      });
    }

    const candidate = data.candidates[0];
    
    // Check if the response was blocked
    if (candidate.finishReason === "SAFETY") {
      return NextResponse.json({
        output: "I apologize, but I cannot provide a response to that request due to safety guidelines. Please try asking something else.",
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: 0,
          total_tokens: prompt.length
        }
      });
    }

    const output = candidate.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

    return NextResponse.json({ 
      output: output.trim(),
      model: "Gemini 2.5 Pro",
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: output.length,
        total_tokens: prompt.length + output.length
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { 
          error: "Invalid API key",
          details: "Please check your Gemini API key configuration"
        },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('model')) {
      return NextResponse.json(
        { 
          error: "Model not available",
          details: "The requested AI model is not available"
        },
        { status: 400 }
      );
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          details: "Please try again in a moment"
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate response",
        details: error.message || "An unexpected error occurred"
      },
      { status: 500 }
    );
  }
}