import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    console.log("Testing Gemini API...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
    console.log("API Key length:", process.env.GEMINI_API_KEY?.length);
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Initialize the Gemini AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("GenAI client created");

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });
    console.log("Model retrieved");

    // Simple test
    const result = await model.generateContent("Say hello");
    console.log("Content generated");
    
    const response = await result.response;
    const text = response.text();
    console.log("Response text:", text);

    return NextResponse.json({ 
      success: true,
      message: text,
      apiKeyConfigured: true
    });

  } catch (error) {
    console.error("Detailed Gemini API Error:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to test Gemini API",
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}