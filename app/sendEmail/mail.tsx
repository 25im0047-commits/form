"use server";

import { EmailTemplateOwner, EmailTemplateCustemer } from "./EmailTemplate";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = new Resend(RESEND_API_KEY);

export async function SEND_TO_OWNER(formData: FormData) {
  console.log("Form Data received:", formData);
  try {
    const { data, error } = await resend.emails.send({
      from: 'K-PASS <reservation@cramreserveform.com>',
      to: ['matuott1230@gmail.com', "shotakobayashi7@gmail.com"],
      subject: 'K-PASS 無料受験相談予約通知',
      react: EmailTemplateOwner(formData),
    });
    console.log("OwnerData:", data, "error", error);
  } catch (error) {
    console.log("Error sending email to customer:", error);
  }
}

export async function SEND_TO_CUSTEMER(formData: FormData) {
  console.log("Form Data received(custemer):", formData);
  const email_customer = formData.get("email") as string;
  console.log("Custemer Email:", email_customer);
  try {
    const { data, error } = await resend.emails.send({
      from: 'K-PASS <reservation@cramreserveform.com>',
      to: [email_customer],
      subject: "K-PASS 無料受験相談予約完了通知",
      react: EmailTemplateCustemer(formData),
    });
    console.log("CustomerData:", data, "error", error);
  } catch (error) {
    console.log("Error sending email to Customer:", error);
  }
}
