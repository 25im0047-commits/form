"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SEND_TO_OWNER, SEND_TO_CUSTEMER } from "@/app/sendEmail/mail";
import { insert_reservation_data } from "@/app/reservation_data/reservation_data";
import { CheckData } from "@/app/reservation_data/reservation_data";

export default function SendForm() {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  const [year, setYear] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: {
      year: "",
      month: "",
      day: "",
      time: "",
    },
    name: "",
    email: "",
    phone: "",
    grade: "",
    school: "",
    kinds: [] as string[],
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

    // checkbox（複数）の処理
    if (type === "checkbox") {
      setForm((prev) => {
        const newKinds = checked
          ? [...prev.kinds, value]
          : prev.kinds.filter((v) => v !== value);

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
    if (!form.email) newErrors.email = true;
    if (!form.phone) newErrors.phone = true;
    if (!form.grade) newErrors.grade = true;
    if (!form.school) newErrors.school = true;
    if (form.kinds.length === 0) newErrors.kinds = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function DateCheck() {
    //チェック処理
    const checktime = `${year}年${month}月${day}日${time}`;

    // 選択された日時が明日以降であるかチェック
    const selectedDate = new Date(
      `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}T${time}:00`
    );
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      alert("エラーが発生しました。");
      return true;
    }

    // 日付の妥当性をチェック
    const dateStr = `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
    const timeStr = time;
    const dateObj = new Date(`${dateStr}T${timeStr}:00`);
    if (isNaN(dateObj.getTime())) {
      alert("エラーが発生しました。");
      return true;
    }

    //時間を改竄されても、予約時間が被らないようにする処理
    const fetch_result = await CheckData(checktime);
    if (fetch_result.data && fetch_result.data.length > 0) {
      alert("エラーが発生しました。");
      return true;
    }

    return false;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    //要素があるかチェック
    if (!validate()) return;

    setDisabled(true);

    //日時チェック処理
    if (await DateCheck()) {
      router.replace("/");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone_number", form.phone);
    formData.append("grade", form.grade);
    formData.append("school", form.school);
    formData.append("kinds", form.kinds.join(", "));
    formData.append(
      "date",
      `${form.date.year}年${form.date.month}月${form.date.day}日${form.date.time}`
    );

    try {
      await SEND_TO_OWNER(formData);
      await SEND_TO_CUSTEMER(formData);
      await insert_reservation_data(formData);
      alert(
        "予約が完了しました。\nご登録いただいたメールアドレスに確認メールを送信しました。"
      );
      router.push("/");
    } catch (error) {
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
              電話番号（ハイフンなし） <span className="text-red-500"> *</span>
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
              placeholder="例）N高等学校"
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
                  type="checkbox"
                  name="kind"
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
            <button className="w-full" disabled={disabled}>
              <Link href="/">
                {/*日程選択のルートを置く*/}
                <p className="bg-white border border-[#00c7ce] text-[#00c7ce] font-bold text-sm rounded-sm py-2.5 text-center hover:bg-gray-200">
                  日時を選び直す
                </p>
              </Link>
            </button>

            <button
              //type="submit"
              className={`mt-5 bg-[#00c7ce] text-white p-3 w-full rounded-sm hover:cursor-pointer hover:bg-[#00b0b8]
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              予約を確定
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
