// src/lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export async function sendAppointmentEmails({ customerName, email, date, time, vehicle, notes }) {
  const logoUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/hero1.webp`;
  const formattedTime = formatTime(time);

  // Email to customer
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Test Drive Appointment with SMK Auto',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Your Test Drive Awaits!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${customerName},</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">We are thrilled to confirm your upcoming test drive appointment with SMK Auto. Get ready to experience the vehicle of your dreams!</p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Date:</strong> ${date}<br>
                <strong style="color: #1a202c;">Time:</strong> ${formattedTime}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Things to Remember:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Please arrive 10-15 minutes before your appointment</li>
                  <li style="margin-bottom: 8px">Bring your valid driver's license</li>
                  <li style="margin-bottom: 8px">Plan for about 45-60 minutes for the complete experience</li>
                </ul>
              </p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Our knowledgeable and friendly team is prepared to provide you with an exceptional test drive experience. We'll be happy to answer any questions you may have and guide you through the features of the vehicle.</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">If you need to make any changes to your appointment or have any additional inquiries, please don't hesitate to reach out to us. We're here to ensure your complete satisfaction.</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">We look forward to seeing you soon!</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
            <p style="font-size: 14px; color: #ffffff; margin-top: 20px;">Questions? Contact us at support@smkauto.com</p>
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
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">New Test Drive Appointment</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Customer:</strong> ${customerName}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Date:</strong> ${date}<br>
                <strong style="color: #1a202c;">Time:</strong> ${formattedTime}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <strong style="color: #1a202c;">Customer Notes:</strong><br>
                <p style="font-size: 18px; line-height: 1.6; color: #4a5568; background-color: #fff; padding: 15px; border-radius: 5px; margin-top: 10px;">
                  ${notes ? notes : 'No notes provided'}
                </p>
              </div>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #FEF3C7; border-radius: 5px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Preparation Checklist:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Clean and prepare the vehicle</li>
                  <li style="margin-bottom: 8px">Check fuel levels</li>
                  <li style="margin-bottom: 8px">Ensure all documentation is ready</li>
                  <li style="margin-bottom: 8px">Verify vehicle condition</li>
                </ul>
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

export async function sendReminderEmails({ customerName, email, date, time, vehicle }) {
  const logoUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/hero1.webp`;
  const formattedTime = formatTime(time);

  // Customer reminder
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reminder: Your Test Drive Appointment Tomorrow',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Test Drive Tomorrow!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${customerName},</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">This is a friendly reminder about your test drive appointment tomorrow with SMK Auto.</p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Date:</strong> ${date}<br>
                <strong style="color: #1a202c;">Time:</strong> ${formattedTime}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Tomorrow's Checklist:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Remember to bring your valid driver's license</li>
                  <li style="margin-bottom: 8px">Plan to arrive 10-15 minutes early</li>
                  <li style="margin-bottom: 8px">Prepare any questions you may have about the vehicle</li>
                  <li style="margin-bottom: 8px">Allow approximately 45-60 minutes for the complete experience</li>
                </ul>
              </p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
              If you need to reschedule or have any questions, please contact us as soon as possible.
            </p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">We look forward to seeing you tomorrow!</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
            <p style="font-size: 14px; color: #ffffff; margin-top: 20px;">Questions? Contact us at support@smkauto.com</p>
          </div>
        </div>
      </div>
    `
  });

  // Admin reminder
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'Reminder: Test Drive Appointment Tomorrow',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Tomorrow's Test Drive</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Customer:</strong> ${customerName}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Date:</strong> ${date}<br>
                <strong style="color: #1a202c;">Time:</strong> ${formattedTime}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #FEF3C7; border-radius: 5px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Tomorrow's Preparation Checklist:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Schedule vehicle cleaning early morning</li>
                  <li style="margin-bottom: 8px">Check and top up fuel levels</li>
                  <li style="margin-bottom: 8px">Test all vehicle functions</li>
                  <li style="margin-bottom: 8px">Prepare vehicle documentation</li>
                  <li style="margin-bottom: 8px">Verify tire pressure and condition</li>
                  <li style="margin-bottom: 8px">Ensure battery is fully charged (if electric)</li>
                  <li style="margin-bottom: 8px">Have keys ready 15 minutes before appointment</li>
                </ul>
              </p>
            </div>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Please ensure the vehicle is prepared for tomorrow's test drive.</p>
          </div>
        </div>
      </div>
    `
  });
}

export async function sendDayOfReminderEmails({ customerName, email, date, time, vehicle }) {
  const logoUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/hero1.webp`;
  const formattedTime = formatTime(time);

  // Customer day-of reminder
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Test Drive Appointment Today!',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Your Test Drive is Today!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${customerName},</p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Time:</strong> ${formattedTime}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Today's Checklist:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Ensure you have your valid driver's license ready</li>
                  <li style="margin-bottom: 8px">Plan to arrive at least 10 minutes early</li>
                  <li style="margin-bottom: 8px">Bring any questions you have about the vehicle</li>
                  <li style="margin-bottom: 8px">You'll need about 45-60 minutes for the full experience</li>
                </ul>
              </p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
              If you need to reach us urgently, please call us immediately.
            </p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">We're looking forward to seeing you today!</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
            <p style="font-size: 14px; color: #ffffff; margin-top: 20px;">Questions? Contact us at support@smkauto.com</p>
          </div>
        </div>
      </div>
    `
  });

  // Admin day-of reminder
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'Test Drive Appointment Today',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Test Drive Today</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Customer:</strong> ${customerName}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Time:</strong> ${formattedTime}<br>
                <strong style="color: #1a202c;">Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}
              </p>
            </div>
            <div style="margin-top: 30px; padding: 20px; background-color: #FEF3C7; border-radius: 5px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Final Checklist:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Complete final vehicle cleaning</li>
                  <li style="margin-bottom: 8px">Double check fuel level</li>
                  <li style="margin-bottom: 8px">Final test of all vehicle functions</li>
                  <li style="margin-bottom: 8px">Gather all necessary documentation</li>
                  <li style="margin-bottom: 8px">Final tire pressure check</li>
                  <li style="margin-bottom: 8px">Set up vehicle for demonstration</li>
                  <li style="margin-bottom: 8px">Have keys and paperwork ready</li>
                </ul>
              </p>
            </div>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Please ensure everything is ready for today's test drive.</p>
          </div>
        </div>
      </div>
    `
  });
}

export async function sendContactFormEmails({ name, email, phone, message }) {
  const logoUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/hero1.webp`;

  // Email to person who submitted form
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank You for Contacting SMK Auto',
    html: `
     <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
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
            <p style="font-size: 14px; color: #ffffff; margin-top: 20px;">Questions? Contact us at support@smkauto.com</p>
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
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">New Contact Form Message</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Name:</strong> ${name}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Phone:</strong> ${phone}<br>
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <strong style="color: #1a202c;">Message:</strong><br>
                <p style="font-size: 18px; line-height: 1.6; color: #4a5568; background-color: #fff; padding: 15px; border-radius: 5px; margin-top: 10px;">${message}</p>
              </div>
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

export async function sendSellTradeEmails({ customerName, email, type, vehicleDetails, desiredVehicle = null }) {
  const logoUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/hero1.webp`;

  // Email to customer
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Your ${type.toUpperCase()} Request with SMK Auto`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Request Received!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${customerName},</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Thank you for submitting your ${type} request with SMK Auto. We have received your information and will review it promptly.</p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Your Vehicle:</strong><br>
                ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}<br>
                ${vehicleDetails.mileage ? `Mileage: ${vehicleDetails.mileage} miles` : ''}
              </p>
              ${desiredVehicle ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <strong style="color: #1a202c;">Desired Vehicle:</strong><br>
                  ${desiredVehicle.year} ${desiredVehicle.make} ${desiredVehicle.model}<br>
                  Stock #: ${desiredVehicle.stockNumber}
                </div>
              ` : ''}
            </div>
            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #FCD34D;">
              <p style="font-size: 18px; line-height: 1.6; color: #92400E;">
                <strong>Next Steps:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li style="margin-bottom: 8px">Our team will review your submission within 24-48 hours</li>
                  <li style="margin-bottom: 8px">We'll contact you to discuss your vehicle and options</li>
                  <li style="margin-bottom: 8px">You'll receive a detailed evaluation of your request</li>
                  <li style="margin-bottom: 8px">We'll work with you to schedule any necessary appointments</li>
                </ul>
              </p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Our team will evaluate your submission and contact you shortly to discuss next steps.</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">We appreciate your interest in working with SMK Auto!</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
            <p style="font-size: 14px; color: #ffffff; margin-top: 20px;">Questions? Contact us at support@smkauto.com</p>
          </div>
        </div>
      </div>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New ${type.toUpperCase()} Request Received`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${logoUrl}" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">New ${type.toUpperCase()} Request</h1>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Customer:</strong> ${customerName}<br>
                <strong style="color: #1a202c;">Email:</strong> ${email}<br>
                <strong style="color: #1a202c;">Vehicle Details:</strong><br>
                ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}<br>
                ${vehicleDetails.mileage ? `Mileage: ${vehicleDetails.mileage} miles` : ''}
              </p>
              ${desiredVehicle ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <strong style="color: #1a202c;">Desired Vehicle:</strong><br>
                  ${desiredVehicle.year} ${desiredVehicle.make} ${desiredVehicle.model}<br>
                  Stock #: ${desiredVehicle.stockNumber}
                </div>
              ` : ''}
            </div>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Please review this request in the admin dashboard.</p>
          </div>
        </div>
      </div>
    `
  });
}

/** NEW FUNCTION BELOW: Thank You Email for a Completed Sale **/
export async function sendSaleThankYouEmail({ customerName, email, vehicle, salePrice }) {
  const { year, make, model } = vehicle;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank You for Your Purchase from SMK Auto!',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <img src="${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/hero1.webp" alt="SMK Auto Logo" style="max-width: 200px;">
          </div>
          <div style="padding: 40px;">
            <h1 style="color: #1a202c; font-size: 32px; margin-bottom: 30px; text-align: center;">Thank You for Your Purchase!</h1>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">Dear ${customerName},</p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">
              We wanted to personally thank you for choosing SMK Auto for your vehicle purchase. We hope you enjoy your new <strong>${year} ${make} ${model}</strong>!
            </p>
            <div style="background-color: #f7fafc; padding: 30px; border-radius: 5px; margin-bottom: 40px; border: 1px solid #e2e8f0;">
              <p style="font-size: 20px; line-height: 1.6; color: #4a5568;">
                <strong style="color: #1a202c;">Final Sale Price:</strong> $${Number(salePrice).toLocaleString()}
              </p>
            </div>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; margin-bottom: 40px;">
              If you have any questions about your vehicle, need further assistance, or want to explore more options, feel free to reach out to us anytime. We're here to help!
            </p>
            <p style="font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center;">Thank you again for your business and welcome to the SMK Auto family!</p>
          </div>
          <div style="background-color: #1a202c; padding: 30px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 18px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">Best regards,<br>The SMK Auto Team</p>
            <p style="font-size: 14px; color: #ffffff; margin-top: 20px;">Questions? Contact us at support@smkauto.com</p>
          </div>
        </div>
      </div>
    `
  });
}
