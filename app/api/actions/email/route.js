import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, subject, body: emailBody, priority = "normal" } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to and subject" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Simulate email sending (replace with actual email service)
    // In production, integrate with SendGrid, Postmark, AWS SES, etc.
    
    const emailData = {
      id: `email_${Date.now()}`,
      to,
      subject,
      body: emailBody || "",
      priority,
      status: "sent",
      sent_at: new Date().toISOString(),
      // Simulate delivery info
      message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: "simulation"
    };

    // In a real implementation, you would do something like:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      // your email service config
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: emailBody,
      // html: htmlBody
    });
    */

    // Log the simulated email for development
    console.log("📧 Simulated Email Sent:", {
      to,
      subject,
      body: emailBody?.substring(0, 100) + (emailBody?.length > 100 ? "..." : ""),
      timestamp: emailData.sent_at
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully (simulated)",
      email: emailData
    });

  } catch (error) {
    console.error("Email API Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}