"use server";

import EmailTemplate from './EmailTemplate';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY

const resend = new Resend(RESEND_API_KEY);


export default async function POST(formData: FormData) {
  console.log('Form Data received:', formData);
  try {
    const { data, error } = await resend.emails.send({
      from: 'K-PASS無料受験相談予約通知 <onboarding@resend.dev>',
      to: [/*'matuott1230@gmail.com'*/'shotakobayashi7@gmail.com'],
      subject: 'K-PASS 無料受験相談予約通知',
      react: EmailTemplate(formData),
    });
    console.log('data:', data, "error", error);
  } catch (error) {
    console.log('Error sending email:', error);
  }
}