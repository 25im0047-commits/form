"use server";

import { EmailTemplateOwner, EmailTemplateCustemer } from "./EmailTemplate";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
console.log(RESEND_API_KEY);

const resend = new Resend(RESEND_API_KEY);

export async function SEND_TO_OWNER(formData: FormData) {
  console.log("オーナーにメールが送信されました");
  try {
    const { data, error } = await resend.emails.send({
      from: "K-PASS <reservation@kpass-form.com>",
      to: ["matuott1230@gmail.com"],
      subject: "K-PASS 無料受験相談予約通知",
      react: EmailTemplateOwner(formData),
    });
    console.log(error);
  } catch (error) {
    console.log(error);
  }
}

export async function SEND_TO_CUSTEMER(formData: FormData) {
  console.log("オーナーにメールが送信されました");
  const email_customer = formData.get("email") as string;
  try {
    const { data, error } = await resend.emails.send({
      from: "K-PASS <reservation@kpass-form.com>",
      to: [email_customer],
      subject: "K-PASS 無料受験相談予約完了通知",
      react: EmailTemplateCustemer(formData),
    });
    console.log(error);
  } catch (error) {
    console.log(error);
  }
}
