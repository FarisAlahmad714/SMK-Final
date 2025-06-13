// src/app/api/cron/reminders/route.js
import { NextResponse } from 'next/server';
import { checkAndSendReminders } from '@/lib/scheduler';

export async function POST(request) {
  try {
    // Add security check
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await checkAndSendReminders();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reminder cron error:', error);
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}