// src/lib/email.js
import nodemailer from 'nodemailer';

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // This needs to be an App Password from Google
  }
});

export async function sendAppointmentEmails({ customerName, email, date, time, vehicle }) {
  // Email to customer
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Test Drive Appointment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Test Drive Appointment Confirmation</h1>
        <p>Dear ${customerName},</p>
        <p>Your test drive has been scheduled for:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>
            <strong>Date:</strong> ${date}<br>
            <strong>Time:</strong> ${time}<br>
            <strong>Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
          </p>
        </div>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>SMK Auto Team</p>
      </div>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Test Drive Appointment',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">New Test Drive Appointment</h1>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p>
            <strong>Customer:</strong> ${customerName}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Date:</strong> ${date}<br>
            <strong>Time:</strong> ${time}<br>
            <strong>Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
          </p>
        </div>
      </div>
    `
  });
}

export async function sendContactFormEmails({ name, email, message }) {
  // Email to person who submitted form
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting SMK Auto',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Thank You for Contacting Us</h1>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Your Message:</strong><br>${message}</p>
        </div>
        <p>Best regards,<br>SMK Auto Team</p>
      </div>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">New Contact Form Message</h1>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p>
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone}<br>
          </p>
          <p><strong>Message:</strong><br>${message}</p>
        </div>
      </div>
  
    `
  });
}