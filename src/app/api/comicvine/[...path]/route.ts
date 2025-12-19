import { NextResponse } from "next/server";

/** Extracts the dynamic path from the request URL to avoid relying on ctx.params */
export async function GET(req: Request) {
  const apiKey = process.env.COMICVINE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing COMICVINE_API_KEY" }, { status: 500 });
  }

  const incoming = new URL(req.url);

  const prefix = "/api/comicvine/";
  const idx = incoming.pathname.indexOf(prefix);
  const path = idx >= 0 ? incoming.pathname.slice(idx + prefix.length) : "";

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const target = new URL(`https://comicvine.gamespot.com/api/${path}`);

  // forward query params
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));

  // enforce required params
  target.searchParams.set("api_key", apiKey);
  target.searchParams.set("format", "json");

  const r = await fetch(target.toString(), {
    headers: { "User-Agent": "bemobile-challenge" },
    cache: "no-store",
  });

  const text = await r.text();

  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}