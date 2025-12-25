import { google } from "googleapis";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 管理者アカウントで自動認証
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    const { startAt } = await req.json();

    if (!startAt) {
      return NextResponse.json(
        { error: "startAt is required" },
        { status: 400 }
      );
    }

    const event = await calendar.events.insert({
      calendarId: "primary", // 管理者のカレンダー
      conferenceDataVersion: 1,
      requestBody: {
        summary: "オンライン面談",
        start: {
          dateTime: new Date(startAt).toISOString(),
          timeZone: "Asia/Tokyo",
        },
        end: {
          dateTime: new Date(new Date(startAt).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: "Asia/Tokyo",
        },
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    const meetLink =
      event.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video"
      )?.uri;

    return NextResponse.json({ meetLink });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}