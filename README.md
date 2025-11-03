# BALTI WOOD — Viber Bot (Node.js)

Quick start on Render:
1) Render → New → Web Service → connect this repo.
2) Build: npm install   •  Start: npm start   • Plan: Free
3) Env vars: VIBER_TOKEN, ARTURS_NUM, MARTINS_NUM, PORT=10000
4) Set webhook:
   curl -X POST https://chatapi.viber.com/pa/set_webhook \
     -H "Content-Type: application/json" \
     -d '{"url":"https://YOUR-RENDER.onrender.com/viber-bot","auth_token":"YOUR_TOKEN"}'
