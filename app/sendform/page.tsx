"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SEND_TO_OWNER, SEND_TO_CUSTEMER } from "@/app/sendEmail/mail";
import { insert_reservation_data } from "@/app/reservation_data/reservation_data";
import { CheckData } from "@/app/reservation_data/reservation_data";
import { error } from "console";

export default function SendForm() {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  const [year, setYear] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const [pushed, setPushed] = useState(false);

  type FormState = {
    date: {
      year: string;
      month: string;
      day: string;
      time: string;
    };
    name: string;
    name_kana: string;
    email: string;
    phone: string;
    grade: string;
    school: string;
    kinds: string;
  };

  const [form, setForm] = useState<FormState>({
    date: {
      year: "",
      month: "",
      day: "",
      time: "",
    },
    name: "",
    name_kana: "",
    email: "",
    phone: "",
    grade: "",
    school: "",
    kinds: "",
  });

  useEffect(() => {
    const y = sessionStorage.getItem("year");
    const m = sessionStorage.getItem("month");
    const d = sessionStorage.getItem("day");
    const t = sessionStorage.getItem("time");

    if (!y || !m || !d || !t) {
      router.replace("/");
      return;
    }

    setYear(y);
    setMonth(m);
    setDay(d);
    setTime(t);

    setForm((prev) => ({
      ...prev,
      date: { year: y, month: m, day: d, time: t },
    }));
  }, [router]);

  const [open, setOpen] = useState(false);

  const options = ["高校1年生", "高校2年生", "高校3年生", "既卒生"];

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;

    if (type === "radio" && name === "kinds") {
      console.log(checked, value);
      setForm((prev) => {
        const newKinds = value;

        return { ...prev, kinds: newKinds };
      });
      return;
    }

    // 通常のinput
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors: Record<string, boolean> = {};

    if (!form.name) newErrors.name = true;
    if (!form.name_kana) newErrors.name_kana = true;
    if (!form.email) newErrors.email = true;
    if (!form.phone) newErrors.phone = true;
    if (!form.grade) newErrors.grade = true;
    if (!form.school) newErrors.school = true;
    if (form.kinds.length === 0) newErrors.kinds = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function DateCheck() {
    if (!year || !month || !day || !time) {
      alert("日時情報が正しく取得できませんでした。");
      return true;
    }

    // DB照合用（表示用文字列）
    const checktime = `${year}年${month}月${day}日${time}`;

    // time を分解（9:00 問題対策）
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    const selectedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hour,
      minute,
      0
    );

    // 日付の妥当性チェック
    if (isNaN(selectedDate.getTime())) {
      alert("日付または時刻の形式が不正です。入力内容を確認してください。");
      return true;
    }

    // 明日以降かどうかチェック
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      alert(
        "エラーが発生しました。予約日時は明日以降の日付を選択してください。"
      );
      return true;
    }

    // 予約重複チェック（時間改竄対策）
    const fetch_result = await CheckData(checktime);
    if (fetch_result.data && fetch_result.data.length > 0) {
      alert(
        "選択された時間帯はすでに予約済みです。別の時間を選択してください。"
      );
      return true;
    }

    // 問題なし
    return false;
  }

  async function handleSubmit(e: any) {
    setPushed(true);
    e.preventDefault();

    //要素があるかチェック
    if (!validate()) {
      setPushed(false);
      return;
    }

    setDisabled(true);

    //日時チェック処理
    if (await DateCheck()) {
      router.replace("/");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("name_kana", form.name_kana);
    formData.append("email", form.email);
    formData.append("phone_number", form.phone);
    formData.append("grade", form.grade);
    formData.append("school", form.school);
    formData.append("kinds", form.kinds);
    formData.append(
      "date",
      `${form.date.year}年${form.date.month}月${form.date.day}日${form.date.time}`
    );

    const formData_DB = formData;

    try {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      //================== Meetリンク生成 ==================
      const [hourStr, minuteStr] = form.date.time.split(":");
      const hour = Number(hourStr);
      const minute = Number(minuteStr);

      const pad = (n: number) => String(n).padStart(2, "0");

      const startAt = `${form.date.year}-${form.date.month}-${form.date.day}T${pad(hour)}:${pad(minute)}`;

      console.log("Creating Meet for:", startAt);

      const res = await fetch("/api/create-meet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startAt }),
      });

      const { meetLink } = await res.json();

      if (!meetLink) {
        throw new Error("Meet link generation failed");
      }

      formData.append("meetLink", meetLink);
      //===================================================
      //=================== DBにinsert ======================
      const dbResult = await insert_reservation_data(formData_DB);
      //===================================================
      
      // スパム判定による処理
      if(dbResult.error){
        alert(
          "エラーが発生しました。少し時間を置いて再度お試しください。"
        );
      } else {
        //=================== メール送信 ======================
        await SEND_TO_OWNER(formData);
        await sleep(600);
        await SEND_TO_CUSTEMER(formData);
        //===================================================
        alert(
          "予約が完了しました。\nご登録いただいたメールアドレスに確認メールを送信しました。"
        );
      }
      router.push("/");
    } catch (error) {
      alert("エラーが発生しました。少し時間を置いて再度お試しください。");
      setDisabled(false);
      setPushed(false);
    }
  }

  return (
    <div
      onClick={() => {
        if (open) {
          setOpen(false);
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1 className="text-center font-bold mb-7 pt-6">予約内容確認</h1>
        {pushed ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="w-[80%] mx-auto pb-30">
            <div>
              <p className="text-sm text-[#789b8b]">日時</p>
              <div className="bg-white rounded-md shadow-md p-5 text-[#a8b1ab]">
                <p className="mb-2">UTC+09:00 Asia/Tokyo</p>
                <p className="mb-2">
                  {year}年 {month}月{day}日（
                  {
                    ["日", "月", "火", "水", "木", "金", "土"][
                      new Date(`${year}-${month}-${day}`).getDay()
                    ]
                  }
                  ）
                </p>
                <p className="font-bold text-xl text-[#304036]">
                  {time} - {`${Number(time?.split(":")[0]) + 1}:00`}
                </p>
              </div>
            </div>

            {/* 氏名 */}
            <div className="mt-7">
              <p className="text-sm text-[#789b8b]">
                氏名<span className="text-red-500"> *</span>{" "}
                {errors.name && (
                  <span className="text-red-500">入力必須項目です。</span>
                )}
              </p>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="w-full bg-white rounded-md shadow-md p-3 mt-2"
                placeholder="例）山田 太郎"
              />
            </div>

            {/* フリガナ */}
            <div className="mt-7">
              <p className="text-sm text-[#789b8b]">
                フリガナ<span className="text-red-500"> *</span>{" "}
                {errors.name_kana && (
                  <span className="text-red-500">入力必須項目です。</span>
                )}
              </p>
              <input
                name="name_kana"
                value={form.name_kana}
                onChange={handleChange}
                type="text"
                className="w-full bg-white rounded-md shadow-md p-3 mt-2"
                placeholder="例）ヤマダ タロウ"
              />
            </div>

            {/* メール */}
            <div className="mt-7">
              <p className="text-sm text-[#789b8b]">
                メールアドレス <span className="text-red-500"> *</span>
                {errors.email && (
                  <span className="text-red-500">入力必須項目です。</span>
                )}
              </p>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full bg-white rounded-md shadow-md p-3 mt-2"
                placeholder="例）yamada@example.com"
              />
            </div>

            {/* 電話番号 */}
            <div className="mt-7">
              <p className="text-sm text-[#789b8b]">
                電話番号（ハイフンなし）{" "}
                <span className="text-red-500"> *</span>
                {errors.phone && (
                  <span className="text-red-500">入力必須項目です。</span>
                )}
              </p>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                pattern="[0-9]{9,14}"
                required
                className="w-full bg-white rounded-md shadow-md p-3 mt-2"
                placeholder="例）08012345678"
              />
            </div>

            {/* 学年 */}
            <div className="mt-7 relative">
              <p className="text-sm text-[#789b8b]">
                学年（属性）※現在の年度の学年を入力ください。小学生は対象年齢外となります。
                <span className="text-red-500"> *</span>{" "}
                {errors.grade && (
                  <span className="text-red-500">入力必須項目です。</span>
                )}
              </p>
              <div
                className="w-full bg-white rounded-md shadow-md p-3 mt-2 cursor-pointer flex justify-between items-center"
                onClick={() => setOpen(!open)}
              >
                <span>{form.grade || "選択してください"}</span>
                <span>▾</span>
              </div>

              {/* ドロップダウン */}
              {open && (
                <div className=" absolute w-full bg-white shadow-md rounded-md mt-1 z-10">
                  {options.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        // 内部 state に学年を設定する（親からの onChange が無くても動作するように）
                        setForm((prev) => ({ ...prev, grade: opt }));
                        setOpen(false);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 学校 */}
            <div className="mt-7">
              <p className="text-sm text-[#789b8b]">
                所属している学校名<span className="text-red-500"> *</span>{" "}
                {errors.school && (
                  <span className="text-red-500">入力必須項目です。</span>
                )}
              </p>
              <input
                name="school"
                value={form.school}
                onChange={handleChange}
                type="text"
                className="w-full bg-white rounded-md shadow-md p-3 mt-2"
                placeholder="例）慶應義塾高校"
              />
            </div>

            {/* 種類 */}
            <div className="mt-7">
              <p className="text-sm text-[#789b8b]">
                お問い合わせサービス<span className="text-red-500"> *</span>{" "}
                {errors.kinds && (
                  <span className="text-red-500">選択必須項目です。</span>
                )}
              </p>

              {[
                "無料受験相談（生徒＋保護者）",
                "無料受験相談（生徒のみ）",
                "入塾説明会（生徒＋保護者）",
                "入塾説明会（保護者のみ）",
              ].map((k) => (
                <label key={k} className="hover:cursor-pointer">
                  <input
                    type="radio"
                    name={`kinds`}
                    value={k}
                    onChange={handleChange}
                    checked={form.kinds.includes(k)}
                  />{" "}
                  {k}
                  <br />
                </label>
              ))}
            </div>
            <div className="mt-7">
              <Link
                href="/"
                className={`block w-full ${
                  disabled ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <p className="bg-white border border-[#00c7ce] text-[#00c7ce] font-bold text-sm rounded-sm py-2.5 text-center hover:bg-gray-200">
                  日時を選び直す
                </p>
              </Link>

              <button
                type="submit"
                className={`mt-5 bg-[#00c7ce] text-white p-3 w-full rounded-sm hover:cursor-pointer hover:bg-[#00b0b8]
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={disabled}
              >
                予約を確定
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
