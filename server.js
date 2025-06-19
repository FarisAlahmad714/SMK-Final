// server.js (CommonJS version)

const express = require('express');
const next = require('next');
const cron = require('node-cron');

// Update this path to wherever your reminder logic lives:
const { checkAndSendReminders } = require('./src/lib/scheduler.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare the Next.js app and then set up our custom server
app.prepare().then(() => {
  const server = express();

  // Example: run reminders every day at 7:00 AM
  // Cron syntax: '0 7 * * *' => "At 07:00 every day"
  cron.schedule('0 7 * * *', async () => {
    console.log('[CRON] Checking & sending reminders at 7 AM...');
    try {
      await checkAndSendReminders();
      console.log('[CRON] Reminders processed successfully.');
    } catch (error) {
      console.error('[CRON] Error processing reminders:', error);
    }
  });

  // For all other routes, let Next.js handle the request
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server on port 3000 (or the PORT env variable)
  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Custom server listening on http://localhost:${port}`);
  });
});
