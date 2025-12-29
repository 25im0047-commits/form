"use server";

import { EmailTemplateOwner, EmailTemplateCustemer } from "./EmailTemplate";
import { Resend } from "resend";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

// サーバーサイドでDOMPurifyを使用するための設定
const window = new JSDOM('').window;
// ここの、windowというのは？JSON('')が必要なの？
const DOMPurifyInstance = DOMPurify(window);

// FormDataをサニタイズする関数
function sanitizeFormData(formData: FormData): FormData {
  const sanitized = new FormData();
  // key = index
  for (const [key, value] of formData.entries()) {
    // entriesってkey value じゃなくて index valueじゃないの？
    if (typeof value === 'string') {
      // 危険なものは文字でありファイルは問題ないのはなぜ？
      const cleanValue = DOMPurifyInstance.sanitize(value, { 
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true
        // ここなんでタグ内部のテキストを保持する必要があるんだっけ？
      });
      sanitized.append(key, cleanValue);
      // key valueペアでsanitizedの配列の一番後ろに戻していくから上でkeyも取る必要があった。
    } else {
      sanitized.append(key, value);
    }
  }
  
  return sanitized;
}

// 塾に対してメールを送信する部品
export async function SEND_TO_OWNER(formData: FormData) {
  const sanitizedFormData = sanitizeFormData(formData);
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

// お客さんにメールを送信する部品
export async function SEND_TO_CUSTEMER(formData: FormData) {
  const sanitizedFormData = sanitizeFormData(formData);
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
