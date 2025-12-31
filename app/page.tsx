"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  select_reservation_data,
  CheckData,
} from "@/app/reservation_data/reservation_data";

export default function HomePage() {
  const router = useRouter();
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);
  const [pushed, setPushed] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const fetch_result = await select_reservation_data();

      const reserved =
        fetch_result?.data?.map((item: any) => item.reservation_date) ?? [];

      setReservedSlots(reserved);
    }

    fetchData();
  }, [router]);

  // baseDate is the first day shown in the week view
  const [baseDate, setBaseDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function addDays(d: Date, days: number) {
    const n = new Date(d);
    n.setDate(n.getDate() + days);
    return n;
  }

  const start = baseDate;
  const end = addDays(baseDate, 6);

  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");

  const fYear = end.getFullYear();
  const fMonth = String(end.getMonth() + 1).padStart(2, "0");
  const fDay = String(end.getDate()).padStart(2, "0");

  useEffect(() => {
    sessionStorage.removeItem("year");
    sessionStorage.removeItem("month");
    sessionStorage.removeItem("day");
    sessionStorage.removeItem("time");
  }, [baseDate]);

  function Ifyear(num: number) {
    return String(addDays(baseDate, num).getFullYear());
  }

  function Ifmonth(num: number) {
    return String(addDays(baseDate, num).getMonth() + 1).padStart(2, "0");
  }

  function nextday(num: number) {
    return String(addDays(baseDate, num).getDate()).padStart(2, "0");
  }

  function Week_r(num: number) {
    return addDays(baseDate, num).getDay();
  }

  async function Selectday(index: number, btnIndex: number) {
    setPushed(true);
    const y = Ifyear(index);
    const m = Ifmonth(index);
    const d = nextday(index);
    const time = `${9 + btnIndex}:00`;

    const checktime = `${y}年${m}月${d}日${time}`;

    //チェック処理
    async function Checkdata() {
      const fetch_result = await CheckData(checktime);
      return fetch_result;
    }

    if (await Checkdata().then((res) => res.data && res.data.length > 0)) {
      alert("エラーが発生しました。");
      location.reload();
      return;
    }

    sessionStorage.setItem("year", y);
    sessionStorage.setItem("month", m);
    sessionStorage.setItem("day", d);
    sessionStorage.setItem("time", time);
    router.push("/sendform");
  }

  function prevWeek() {
    // prevent moving to a week that starts before today
    const candidate = addDays(baseDate, -7);
    if (candidate < today) {
      // if candidate is before today, clamp to today
      setBaseDate(addDays(today, 1));
    } else {
      setBaseDate(candidate);
    }
  }

  function nextWeek() {
    setBaseDate((p) => addDays(p, 7));
  }

  const canGoPrev = baseDate > today;

  return (
    <div className="mt-2">
      <div className="h-[20%] mt-2">
        <div className=" grid grid-cols-1 gap-3 md:grid-cols-5 grid-rows-1 w-[90%] mx-auto">
          {/* 前の週ボタン */}
          <button
            className={` ${
              !canGoPrev ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            } bg-white rounded-md font-bold m-2 my-1 px-4 py-2 text-[#00c7ce] shadow-md order-2 md:order-1`}
            disabled={!canGoPrev}
            onClick={prevWeek}
          >
            ＜ 前の週
          </button>

          <div className=" md:col-span-2 order- md:order-2">
            <p className="text-center grid grid-cols-2 grid-rows-2 items-end">
              <span className="text-sm col-span-1 place-self-end mr-3">
                {`${year}`}年
              </span>
              <span className="text-2xl col-span-2">
                {`${month}/${day}`} - {`${fMonth}/${fDay}`}
              </span>
            </p>
          </div>

          <button
            className="hidden md:block bg-white rounded-md font-bold m-2 my-1 px-4 py-2 hover:bg-gray-200 text-[#00c7ce] shadow-md order-3"
            onClick={nextWeek}
          >
            次の週 ＞
          </button>
          <button
            className="block md:hidden bg-white rounded-md font-bold m-2 my-1 px-4 py-2 hover:bg-gray-200 text-[#00c7ce] shadow-md order-3"
            onClick={nextWeek}
          >
            ＞ 次の週
          </button>

          {/* 右端のボタン（機能を次の週に統一） */}
          <button
            className=" hidden md:block bg-white rounded-md font-bold m-2 my-1 px-4 py-2 hover:bg-gray-200 text-[#00c7ce] shadow-md order-4"
            onClick={() => setBaseDate(addDays(today, 1))}
          >
            最短日時
          </button>
        </div>

        <h3 className="text-center text-md pt-8">
          ご希望の日時を選択してください
        </h3>
        {pushed ? (
          <div className="loader">Loading...</div>
        ) : (
          <div>
            {Array(7)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className=" border-b border-[#88c6c8] w-[90%] mx-auto mb-3"
                >
                  <h3 className="">
                    <span
                      className={`text-2xl ${
                        Number(nextday(index)) === new Date().getDate() &&
                        addDays(baseDate, index).getMonth() ===
                          new Date().getMonth() &&
                        addDays(baseDate, index).getFullYear() ===
                          new Date().getFullYear()
                          ? "text-[#00c7ce]"
                          : ""
                      }`}
                    >
                      {nextday(index)}
                    </span>{" "}
                    <span
                      className={`text-[0.75rem] ${
                        Number(nextday(index)) === new Date().getDate() &&
                        addDays(baseDate, index).getMonth() ===
                          new Date().getMonth() &&
                        addDays(baseDate, index).getFullYear() ===
                          new Date().getFullYear()
                          ? "text-[#00c7ce]"
                          : ""
                      }`}
                    >
                      {
                        ["日", "月", "火", "水", "木", "金", "土"][
                          (baseDate.getDay() + index) % 7
                        ]
                      }
                    </span>
                  </h3>
                  <div className="overflow-x-auto whitespace-nowrap">
                    {Array(13)
                      .fill(null)
                      .map((_, btnIndex) => {
                        const y = Ifyear(index);
                        const m = Ifmonth(index);
                        const d = nextday(index);
                        const time = `${9 + btnIndex}:00`;
                        const checktime = `${y}年${m}月${d}日${time}`;
                        let disabled = false;

                        if (reservedSlots.includes(checktime)) {
                          disabled = true;
                        }

                        return (
                          <button
                            key={btnIndex}
                            disabled={disabled}
                            onClick={() => {
                              Selectday(index, btnIndex);
                            }}
                            className={`shadow-md w-[120px] border border-[#00c7ce] text-[#00c7ce] text-xl rounded-sm px-4 py-2 my-2 mb-4 mx-1 inline-block
                            ${disabled ? "opacity-50 border-[#4a4a4a] text-[#4a4a4a] bg-[#dfdfdf] cursor-not-allowed" : "bg-white hover:bg-gray-200"}`}
                          >
                            {9 + btnIndex}:00
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
