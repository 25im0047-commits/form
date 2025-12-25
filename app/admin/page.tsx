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
    </>
  );
}
