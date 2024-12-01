import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/api/contact');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e5e5e5;
    }
    .email-header {
      background-color: #4a90e2;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .email-header h3 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333;
    }
    .email-body p {
      margin: 10px 0;
    }
    .email-body strong {
      color: #4a90e2;
    }
    .email-footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888;
    }
    .email-footer a {
      color: #4a90e2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h3>📩 New Contact Form Submission</h3>
    </div>
    <div class="email-body">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #4a90e2; text-decoration: none;">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="margin-left: 20px; border-left: 4px solid #4a90e2; padding-left: 10px; color: #555;">
        ${message.replace(/\n/g, "<br>")}
      </p>
    </div>
    <div class="email-footer">
      <p>Thank you for your submission! We will respond promptly.</p>
      <p>If you have any questions, feel free to contact us directly at 
        <a href="mailto:support@example.com">support@example.com</a>.
      </p>
    </div>
  </div>
</body>
</html>

      `,
    });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
