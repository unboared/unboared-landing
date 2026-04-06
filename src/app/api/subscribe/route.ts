import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const DC = process.env.MAILCHIMP_DC; // e.g. "us1", "us21"

  if (!API_KEY || !LIST_ID || !DC) {
    console.error("Mailchimp env vars missing");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  const url = `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address: email,
    status: "subscribed",
    tags: ["lead-magnet-checklist"],
  };

  const credentials = Buffer.from(`anystring:${API_KEY}`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    // Already subscribed → treat as success
    if (res.status === 400 && json.title === "Member Exists") {
      return NextResponse.json({ success: true });
    }

    if (!res.ok) {
      console.error("Mailchimp error:", json);
      return NextResponse.json({ error: json.detail || "Erreur Mailchimp" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Erreur réseau" }, { status: 500 });
  }
}
