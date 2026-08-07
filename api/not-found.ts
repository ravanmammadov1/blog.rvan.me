import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return res.status(404).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Page Not Found — Ravan Mammadov</title>
  </head>
  <body>
    <main>
      <h1>Page Not Found</h1>
      <p>The requested page could not be found.</p>
      <a href="/">Return to the portfolio</a>
    </main>
  </body>
</html>`);
}
