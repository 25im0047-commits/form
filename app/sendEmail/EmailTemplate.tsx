import React from "react";

export function EmailTemplateOwner(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone_number") as string;
  const grade = formData.get("grade") as string;
  const school = formData.get("school") as string;
  const kinds = formData.get("kinds") as string;
  const date = formData.get("date") as string;
  const meetLink = formData.get("meetLink") as string;

  return (
    <>
      <div className="p-4 font-sans">
        <p className="mb-4">K-PASSの無料受験相談の予約が入りました。</p>

        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="py-1 pr-2">予約者</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{name}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">メールアドレス</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{email}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">電話番号（ハイフンなし）</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{phone}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">学年</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{grade}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">学校名</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{school}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">予約種類</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{kinds}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">日程</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">{date}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2">Meetリンク</td>
              <td className="py-1 px-2">:</td>
              <td className="py-1 pl-2">
                <a href={meetLink}>{meetLink}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export function EmailTemplateCustemer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone_number") as string;
  const grade = formData.get("grade") as string;
  const school = formData.get("school") as string;
  const kinds = formData.get("kinds") as string;
  const date = formData.get("date") as string;
  const meetLink = formData.get("meetLink") as string;

  return (
    <>
      <div className="p-4 font-sans text-sm leading-relaxed tracking-normal text-gray-800">
        <p>
          {name} 様
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
          <span className="tracking-wide text-gray-500">
            ────────────────────
            <br />■ ご予約内容
            <br />
            ────────────────────
          </span>
          <br />
          【日時】
          <br />
          <span className="font-semibold">{date} ~</span>
          <br />
          <br />
          【相談形式】 オンライン（Google Meet）
          <br />
          <br />
          【参加用URL】
          <br />
          {meetLink ? (
            <a
              href={meetLink}
              className="text-blue-600 underline break-all tracking-wide"
            >
              {meetLink}
            </a>
          ) : (
            <span className="text-red-600">
              ※現在、参加URLを発行できていません。後ほどご連絡いたします。
            </span>
          )}
          <br />
          <span className="text-xs text-gray-600">
            ※開始時刻になりましたら、上記URLへアクセスしてください。
            <br />
            ※事前にGoogle Meetが利用可能かご確認をお願いいたします。
          </span>
          <br />
          <br />
          <span className="tracking-wide text-gray-500">
            ────────────────────
            <br />■ 当日のご相談内容について
            <br />
            ────────────────────
          </span>
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
          <span className="tracking-wide text-gray-500">
            ────────────────────
            <br />■ ご注意事項
            <br />
            ────────────────────
          </span>
          <br />
          ・開始時刻の5分前を目安にご入室ください。
          <br />
          ・ご都合が悪くなった場合は、事前に公式LINEよりご連絡をお願いいたします。
          <br />
          <br />
          ご不明な点がございましたら、
          <br />
          公式LINEよりお気軽にお問い合わせください。
          <br />
          当日お話しできることを、スタッフ一同楽しみにしております。
          <br />
          <br />
          <span className="tracking-wide text-gray-500">
            ────────────────────
          </span>
          <br />
          <span className="text-xs text-gray-600">
            K-PASS 受験相談窓口
            <br />
            ※ご連絡は公式LINEよりお願いいたします
          </span>
        </p>
      </div>
    </>
  );
}
