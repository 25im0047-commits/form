import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({
      access_token: session.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}