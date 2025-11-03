import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const AUTH_TOKEN = process.env.VIBER_TOKEN || "";
const API_URL = "https://chatapi.viber.com/pa/send_message";
const PORT = process.env.PORT || 8000;
const ARTURS_NUM = process.env.ARTURS_NUM || "+37127084443";
const MARTINS_NUM = process.env.MARTINS_NUM || "+37129780829";

if (!AUTH_TOKEN) {
  console.warn("⚠️ Missing VIBER_TOKEN environment variable!");
}

function contactKeyboard() {
  return {
    Type: "keyboard",
    DefaultHeight: true,
    Buttons: [
      {
        Columns: 6, Rows: 1,
        ActionType: "open-url",
        ActionBody: `viber://chat?number=${ARTURS_NUM}`,
        Text: "✉️ Rakstīt Artūram"
      },
      {
        Columns: 6, Rows: 1,
        ActionType: "open-url",
        ActionBody: `viber://chat?number=${MARTINS_NUM}`,
        Text: "✉️ Rakstīt Mārtiņam"
      }
    ]
  };
}

async function sendText(receiver, text, keyboard=null) {
  const payload = {
    receiver,
    min_api_version: 7,
    sender: { name: "BALTI WOOD" },
    type: "text",
    text
  };
  if (keyboard) payload.keyboard = keyboard;

  try {
    const r = await axios.post(API_URL, payload, {
      headers: { "X-Viber-Auth-Token": AUTH_TOKEN }
    });
    return r.data;
  } catch (err) {
    console.error("Viber send error:", err?.response?.data || err.message);
    return { status: 1, error: err?.response?.data || err.message };
  }
}

// Health check
app.get("/", (req, res) => res.status(200).send("BALTI WOOD Viber bot OK"));

// Webhook endpoint
app.post("/viber-bot", async (req, res) => {
  const data = req.body || {};
  const event = data.event;

  if (!event && data.status === 0) {
    return res.status(200).json({ status: 0 });
  }

  if (event === "conversation_started") {
    const userId = data.user?.id;
    await sendText(userId, "Sveiki! BALTI WOOD 👋 Kā varam palīdzēt?", contactKeyboard());
    return res.status(200).json({ status: 0 });
  }

  if (event === "message") {
    const userId = data.sender?.id;
    const text = data.message?.text || "";
    await sendText(userId, `Saņēmām: ${text}\n📞 +371 27084443 • www.baltiwood.lv`);
    return res.status(200).json({ status: 0 });
  }

  return res.status(200).json({ status: 0 });
});

app.listen(PORT, () => {
  console.log("Viber bot running on port", PORT);
});
