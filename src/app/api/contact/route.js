// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import { sendContactFormEmails } from '@/lib/email';

export async function POST(request) {
  try {
    const data = await request.json();

    // Send emails using your email utility
    await sendContactFormEmails({
      name: data.fullName, // Note we use fullName to match your form data
      email: data.email,
      message: data.message
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' }, 
      { status: 500 }
    );
  }
}