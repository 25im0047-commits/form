"use client";

import { useState } from "react";

export default function AdminPage() {
  const [startAt, setStartAt] = useState("");
  async function createMeet() {
    const res = await fetch("/api/create-meet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startAt, // ← これを渡す
      }),
    });
    const { meetLink } = await res.json();
    alert(meetLink);
  }

  return (
    <>
      <h1>admin page</h1>
      <input
        type="datetime-local"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
      />
      <button onClick={createMeet} className="border">
        Create Meet
      </button>

      <div className="p-4 font-sans">
        <p>
          〇〇 様
          <br />
          <br />
          この度は、K-PASSの無料受験相談にお申し込みいただき、
          <br />
          誠にありがとうございます。
          <br />
          以下の内容で、無料受験相談のご予約が完了しましたので
          <br />
          お知らせいたします。
          <br />
          <br />
          ────────────────────
          <br />■ ご予約内容
          <br />
          ────────────────────
          <br />
          【日時】
          <br />
          2026年1月2日（金）9:00〜10:00
          <br />
          【相談形式】 オンライン（Google Meet）
          <br />
          <br />
          【参加用URL】 ▼ 以下のリンクからご参加ください
          <br />
          https://meet.google.com/xxx-xxxx-xxx
          <br />
          ※開始時刻になりましたら、上記URLへアクセスしてください。
          <br />
          ※事前にGoogle Meetが利用可能かご確認をお願いいたします。
          <br />
          <br />
          ────────────────────
          <br />■ 当日のご相談内容について
          <br />
          ────────────────────
          <br />
          ・志望校選びについて
          <br />
          ・受験科目や学習計画について
          <br />
          ・現在の成績や不安点のご相談
          <br />
          など、どんな内容でもお気軽にご相談ください。
          <br />
          <br />
          ────────────────────
          <br />■ ご注意事項
          <br />
          ────────────────────
          <br />
          ・開始時刻の5分前を目安にご入室ください。
          <br />
          ・ご都合が悪くなった場合は、事前にご連絡をお願いいたします。
          <br />
          <br />
          ────────────────────
          <br />
          <br />
          ご不明な点がございましたら、
          <br />
          公式サイトよりお問い合わせください。
          <br />
          当日お話しできることを、スタッフ一同楽しみにしております。
          <br />
          <br />
          ────────────────────
          <br />
          K-PASS 受験相談窓口
          <br />
          公式サイトお問い合わせフォーム：https://kpass-form.com
          <br />
          ────────────────────
        </p>
      </div>
    </>
  );
}
