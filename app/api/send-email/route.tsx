"use server";

import { EmailTemplate } from '@/app/components/EmailTemplate';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY

const resend = new Resend(RESEND_API_KEY);


export default async function POST(formData: FormData) {
  console.log('Form Data received:', formData);
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['matuott1230@gmail.com'],
      subject: 'test mail',
      react: EmailTemplate(),
    });
    console.log('data:', data, "error", error);
  } catch (error) {
    console.log('Error sending email:', error);
  }
}