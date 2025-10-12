import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: q (location)" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "Weather service not configured",
          message: "OpenWeather API key not found. Set OPENWEATHER_API_KEY environment variable."
        },
        { status: 503 }
      );
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }
      throw new Error(`OpenWeather API returned ${response.status}`);
    }

    const data = await response.json();

    // Extract and format weather information
    const weather = {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      main: data.weather[0].main,
      icon: data.weather[0].icon,
      wind_speed: data.wind?.speed || 0,
      wind_direction: data.wind?.deg || 0,
      visibility: data.visibility,
      clouds: data.clouds?.all || 0,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      timezone: data.timezone,
      coord: data.coord
    };

    return NextResponse.json(weather);

  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}