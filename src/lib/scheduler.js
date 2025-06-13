// scheduler.js (CommonJS version)

// 1. Require Prisma (using a relative path to prisma.js)
const prisma = require('./prisma');

// 2. Require your Nodemailer/email functions
const {
  sendReminderEmails,
  sendDayOfReminderEmails,
} = require('./email');

// 3. Utilities from date-fns or similar
const { startOfDay, endOfDay, addDays } = require('date-fns');

/**
 * Check and send day-of reminders
 * For all confirmed appointments happening *today* that haven't had day-of reminders sent.
 */
async function checkAndSendDayOfReminders() {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    // Find all appointments for "today" that are CONFIRMED and dayOfReminderSent = false
    const todaysAppointments = await prisma.testDrive.findMany({
      where: {
        status: 'CONFIRMED',
        dayOfReminderSent: false,
        date: { gte: start, lte: end },
      },
      include: {
        vehicle: true,
      },
    });

    // Send day-of emails for each
    for (const appt of todaysAppointments) {
      try {
        await sendDayOfReminderEmails({
          customerName: appt.customerName,
          email: appt.email,
          date: appt.date.toLocaleDateString(), // or whatever format you prefer
          time: appt.time,
          vehicle: appt.vehicle,
        });

        // Update DB
        await prisma.testDrive.update({
          where: { id: appt.id },
          data: { dayOfReminderSent: true },
        });

        console.log(`Day-of reminder sent for appointment ID: ${appt.id}`);
      } catch (err) {
        console.error(`Error sending day-of reminder for appt ID: ${appt.id}`, err);
      }
    }

    console.log(`Processed ${todaysAppointments.length} day-of reminders.`);
  } catch (error) {
    console.error('Error in checkAndSendDayOfReminders:', error);
  }
}

/**
 * Check and send next-day (or “tomorrow”) reminders
 * For all confirmed appointments happening *tomorrow* that haven't had nextDayReminderSent = true.
 */
async function checkAndSendNextDayReminders() {
  try {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const start = startOfDay(tomorrow);
    const end = endOfDay(tomorrow);

    // Find appointments for tomorrow
    const tomorrowsAppointments = await prisma.testDrive.findMany({
      where: {
        status: 'CONFIRMED',
        nextDayReminderSent: false,
        date: { gte: start, lte: end },
      },
      include: {
        vehicle: true,
      },
    });

    for (const appt of tomorrowsAppointments) {
      try {
        await sendReminderEmails({
          customerName: appt.customerName,
          email: appt.email,
          date: appt.date.toLocaleDateString(),
          time: appt.time,
          vehicle: appt.vehicle,
        });

        await prisma.testDrive.update({
          where: { id: appt.id },
          data: { nextDayReminderSent: true },
        });

        console.log(`Next-day reminder sent for appointment ID: ${appt.id}`);
      } catch (err) {
        console.error(`Error sending next-day reminder for appt ID: ${appt.id}`, err);
      }
    }

    console.log(`Processed ${tomorrowsAppointments.length} next-day reminders.`);
  } catch (error) {
    console.error('Error in checkAndSendNextDayReminders:', error);
  }
}

/**
 * checkAndSendReminders
 * A convenience function that calls both day-of and next-day reminders in one shot.
 */
async function checkAndSendReminders() {
  try {
    await checkAndSendDayOfReminders();
    await checkAndSendNextDayReminders();
    console.log('All reminders processed.');
  } catch (err) {
    console.error('Error in checkAndSendReminders:', err);
  }
}

// Export the functions for use in server.js or anywhere else
module.exports = {
  checkAndSendReminders,
  checkAndSendDayOfReminders,
  checkAndSendNextDayReminders,
};
