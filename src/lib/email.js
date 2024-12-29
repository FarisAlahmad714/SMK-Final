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
    subject: 'Your Test Drive Appointment with SMK Auto',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://your-company-logo-url.com" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Your Test Drive Awaits!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${customerName},</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">We are thrilled to confirm your upcoming test drive appointment with SMK Auto. Get ready to experience the vehicle of your dreams!</p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Date:</strong> ${date}<br>
                <strong style="color: #1a202c;">Time:</strong> ${time}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Our knowledgeable and friendly team is prepared to provide you with an exceptional test drive experience. We'll be happy to answer any questions you may have and guide you through the features of the vehicle.</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">If you need to make any changes to your appointment or have any additional inquiries, please don't hesitate to reach out to us. We're here to ensure your complete satisfaction.</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">We look forward to seeing you soon!</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
          </div>
        </div>
      </div>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Test Drive Appointment Scheduled',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://your-company-logo-url.com" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">New Test Drive Appointment</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Customer:</strong> ${customerName}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Date:</strong> ${date}<br>
                <strong style="color: #1a202c;">Time:</strong> ${time}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Please ensure the vehicle is prepared for the test drive.</p>
          </div>
        </div>
      </div>
    `
  });
}

export async function sendContactFormEmails({ name, email, phone, message }) {
  // Email to person who submitted form
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank You for Contacting SMK Auto',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://your-company-logo-url.com" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">We Appreciate Your Message!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${name},</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Thank you for reaching out to SMK Auto. We value your interest and the time you took to contact us. Our dedicated team has received your message and is eager to provide you with the assistance you need.</p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;"><strong style="color: #1a202c;">Your Message:</strong><br>${message}</p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">We strive to respond to all inquiries in a timely manner. One of our knowledgeable representatives will be in touch with you shortly to address your questions or concerns.</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">In the meantime, feel free to explore our website for more information about our vehicles and services.</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
          </div>
        </div>
      </div>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Contact Form Submission Received',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="https://your-company-logo-url.com" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">New Contact Form Message</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Name:</strong> ${name}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Phone:</strong> ${phone}<br>
              </p>
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;"><strong style="color: #1a202c;">Message:</strong><br>${message}</p>
            </div>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Please follow up with the customer as soon as possible.</p>
          </div>
        </div>
      </div>
    `
  });
}