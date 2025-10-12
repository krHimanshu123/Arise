import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
  try {
    // List available models
    const listModelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const models = await listModelsResponse.json();
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}