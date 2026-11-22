import { NextResponse } from "next/server";
import { WHATSAPP_URL } from "./contact";

const notice = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Storefront maintenance | Mwaleo Green Energy</title>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <style>
    @font-face{font-family:DM Sans;src:url(/fonts/dm-sans-latin.woff2) format("woff2");font-weight:100 1000;font-display:swap}
    @font-face{font-family:Montserrat;src:url(/fonts/montserrat-latin.woff2) format("woff2");font-weight:100 900;font-display:swap}
    :root{color-scheme:light dark;--paper:#fff;--stone:#f5f4f0;--ink:#14181b;--sun:#f9a11b;--page:var(--paper);--panel:var(--stone);--text:var(--ink);--muted:#454e55;--line:#dfded8}
    *{box-sizing:border-box}
    body{margin:0;background:var(--page);color:var(--text);font:400 1rem/1.55 "DM Sans",sans-serif}
    .wrap{width:min(100% - 3rem,74rem);margin-inline:auto}
    header{border-bottom:1px solid var(--line)}
    header .wrap{display:flex;align-items:center;min-height:5.5rem}
    .brand{display:block;width:10rem;height:auto}
    main{display:grid;grid-template-columns:1.15fr 1fr;align-items:center;gap:clamp(2rem,7vw,7rem);min-height:calc(100svh - 5.5rem);padding-block:clamp(2.5rem,7vh,6rem)}
    .status{display:inline-flex;align-items:center;gap:.6rem;color:var(--muted);font-size:.875rem;font-weight:700;margin:0 0 1rem}
    .status::before{content:"";width:.55rem;height:.55rem;background:var(--sun);border-radius:50%}
    h1{max-width:12ch;font:800 clamp(2.5rem,5.5vw,5rem)/1.02 Montserrat,sans-serif;letter-spacing:-.045em;margin:0}
    .message{max-width:36ch;color:var(--muted);font-size:clamp(1.05rem,2vw,1.25rem);margin:1.25rem 0 0}
    .action{display:inline-flex;align-items:center;min-height:3rem;margin-top:1.75rem;padding:.65rem 1.1rem;border-radius:4px;background:var(--sun);color:var(--ink);font-weight:700;text-decoration:none}
    .action:hover{text-decoration:underline}
    .action:focus-visible{outline:2px solid var(--text);outline-offset:4px}
    figure{margin:0;padding:clamp(1rem,3vw,2.5rem);display:grid;justify-items:center;gap:1rem;background:var(--panel);border:1px solid var(--line);border-radius:4px}
    figure img{display:block;width:100%;height:clamp(13rem,38vw,26rem);object-fit:contain}
    figcaption{color:var(--muted);font-size:.875rem;text-align:center}
    @media(prefers-color-scheme:dark){:root{--page:var(--ink);--panel:#1f2428;--text:#fff;--muted:#c1c8ce;--line:#363e44}}
    @media(max-width:700px){header .wrap{min-height:4.5rem}main{grid-template-columns:1fr;min-height:auto;gap:2rem}figure img{height:13rem}}
  </style>
</head>
<body>
  <header><div class="wrap"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="/mwaleo-logo-horizontal-reverse.svg">
    <img class="brand" src="/mwaleo-logo-horizontal.svg" alt="Mwaleo Green Energy">
  </picture></div></header>
  <main class="wrap">
    <section aria-labelledby="notice-title">
      <p class="status">Storefront maintenance</p>
      <h1 id="notice-title">We’re improving our storefront.</h1>
      <p class="message">We’re updating our solar catalogue and product information. The online shop is temporarily paused.</p>
      ${WHATSAPP_URL ? `<a class="action" href="${WHATSAPP_URL}">Ask us on WhatsApp</a>` : ""}
    </section>
    <figure>
      <img src="/solar/felicity-ivem6048-ii.png" alt="White Felicity Solar inverter with a circular display">
      <figcaption>Felicity Solar IVEM6048-II off-grid inverter</figcaption>
    </figure>
  </main>
</body>
</html>`;

export function maintenanceResponse(pathname: string, method: string) {
  const api = pathname === "/api" || pathname.startsWith("/api/");
  const body = api ? JSON.stringify({ error: "Storefront temporarily unavailable for maintenance." }) : notice;

  return new NextResponse(method === "HEAD" ? null : body, {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": api ? "application/json; charset=utf-8" : "text/html; charset=utf-8",
      "Retry-After": "1800",
    },
  });
}
