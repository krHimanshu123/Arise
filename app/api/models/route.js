import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // List available models using the v1beta API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`List Models Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ 
        error: `HTTP ${response.status}: ${errorText}`,
        details: "Failed to list models"
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Filter models that support generateContent
    const generateContentModels = data.models?.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );

    return NextResponse.json({ 
      allModels: data.models?.length || 0,
      generateContentModels: generateContentModels?.map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedMethods: m.supportedGenerationMethods
      })) || [],
      raw: data
    });

  } catch (error) {
    console.error("Models list error:", error);
    return NextResponse.json({ 
      error: error.message,
      details: "Failed to fetch models list"
    }, { status: 500 });
  }
}