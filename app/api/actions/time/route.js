import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const timezone = searchParams.get("timezone") || "local";

  try {
    const now = new Date();
    
    let timeData = {
      timestamp: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
      timezone: timezone
    };

    if (timezone === "local" || timezone === "auto") {
      // Return local time
      timeData = {
        ...timeData,
        time: now.toLocaleString(),
        date: now.toLocaleDateString(),
        time_only: now.toLocaleTimeString(),
        day_of_week: now.toLocaleDateString('en-US', { weekday: 'long' }),
        month: now.toLocaleDateString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        timezone_offset: now.getTimezoneOffset()
      };
    } else {
      // Try to format for specific timezone
      try {
        const localeTime = now.toLocaleString('en-US', { 
          timeZone: timezone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          weekday: 'long'
        });
        
        timeData = {
          ...timeData,
          time: localeTime,
          date: now.toLocaleDateString('en-US', { timeZone: timezone }),
          time_only: now.toLocaleTimeString('en-US', { timeZone: timezone }),
          day_of_week: now.toLocaleDateString('en-US', { weekday: 'long', timeZone: timezone }),
          month: now.toLocaleDateString('en-US', { month: 'long', timeZone: timezone }),
          year: now.getFullYear()
        };
      } catch (timezoneError) {
        // Invalid timezone, fall back to UTC
        timeData = {
          ...timeData,
          time: now.toUTCString(),
          date: now.toISOString().split('T')[0],
          time_only: now.toUTCString().split(' ')[4],
          day_of_week: now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
          month: now.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }),
          year: now.getUTCFullYear(),
          timezone: "UTC",
          error: `Invalid timezone '${timezone}', showing UTC instead`
        };
      }
    }

    // Add additional time information
    timeData.additional_info = {
      is_weekend: [0, 6].includes(now.getDay()),
      day_of_year: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24),
      week_of_year: Math.ceil(((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7),
      quarter: Math.floor((now.getMonth() + 3) / 3),
      is_leap_year: ((now.getFullYear() % 4 === 0) && (now.getFullYear() % 100 !== 0)) || (now.getFullYear() % 400 === 0)
    };

    return NextResponse.json(timeData);

  } catch (error) {
    console.error("Time API Error:", error);
    return NextResponse.json(
      { error: "Failed to get time information" },
      { status: 500 }
    );
  }
}