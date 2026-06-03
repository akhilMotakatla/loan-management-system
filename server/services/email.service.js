import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: `"Premier Bank" <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

export const applicationStatusEmail = (firstName, status, applicationNumber) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#050B1A;color:#E8E8F0;padding:40px;border-radius:8px">
  <h2 style="color:#C9A84C">Premier Bank</h2>
  <h3>Loan Application Update</h3>
  <p>Dear ${firstName},</p>
  <p>Your application <strong style="color:#C9A84C">${applicationNumber}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
  <p>Log in to your account to view full details.</p>
  <p style="color:#A8A8C0;font-size:12px">© ${new Date().getFullYear()} Premier Bank. All rights reserved.</p>
</div>`;
