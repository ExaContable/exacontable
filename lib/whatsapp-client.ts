import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import * as path from "path";
import QRCode from "qrcode";
import pino from "pino";

const logger = pino({ level: "silent" });

const AUTH_DIR = path.join(process.cwd(), "whatsapp-auth");

let socket: ReturnType<typeof makeWASocket> | null = null;
let _qrCode: string | null = null;
let _qrBase64: string | null = null;
let _connected = false;
let _initializing = false;

const globalRef = globalThis as unknown as {
  __whatsappSocket?: ReturnType<typeof makeWASocket>;
  __whatsappConnected?: boolean;
  __whatsappQR?: string | null;
  __whatsappQRBase64?: string | null;
};

export function getQR() {
  return { qr: _qrCode, qrBase64: _qrBase64 };
}

export function isConnected() {
  return _connected || globalRef.__whatsappConnected === true;
}

function setQR(qr: string | null) {
  _qrCode = qr;
  globalRef.__whatsappQR = qr;
  if (qr) {
    QRCode.toDataURL(qr, { width: 300, margin: 2 })
      .then((url) => {
        _qrBase64 = url;
        globalRef.__whatsappQRBase64 = url;
      })
      .catch(() => {});
  } else {
    _qrBase64 = null;
    globalRef.__whatsappQRBase64 = null;
  }
}

function setConnected(v: boolean) {
  _connected = v;
  globalRef.__whatsappConnected = v;
  if (v) setQR(null);
}

export async function initWhatsApp() {
  if (globalRef.__whatsappSocket) {
    socket = globalRef.__whatsappSocket;
    return;
  }
  if (socket || _initializing) return;
  _initializing = true;

  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    socket = makeWASocket({
      auth: state,
      logger,
      browser: Browsers.windows("Chrome"),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      printQRInTerminal: false,
      generateHighQualityLinkPreview: false,
    });

    globalRef.__whatsappSocket = socket;

    socket.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        setQR(qr);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
        console.log("[WhatsApp] QR generado. Escanea con tu telefono:");
        console.log("[WhatsApp] " + qrUrl);
      }

      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        if (statusCode === DisconnectReason.loggedOut) {
          console.log("[WhatsApp] Logged out, removing auth");
          fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          setConnected(false);
          socket = null;
          delete globalRef.__whatsappSocket;
        } else {
          console.log("[WhatsApp] Disconnected, reconnecting...");
          setConnected(false);
          socket = null;
          delete globalRef.__whatsappSocket;
          _initializing = false;
          setTimeout(initWhatsApp, 5000);
        }
      }

      if (connection === "open") {
        console.log("[WhatsApp] Connected successfully!");
        setConnected(true);
      }
    });

    socket.ev.on("creds.update", saveCreds);
  } catch (error) {
    console.error("[WhatsApp] Init error:", error);
    _initializing = false;
  } finally {
    _initializing = false;
  }
}

export async function disconnectWhatsApp() {
  const sock = socket || globalRef.__whatsappSocket;
  if (sock) {
    try {
      sock.end(undefined);
    } catch (e) {
      console.error("[WhatsApp] Error ending socket:", e);
    }
  }
  socket = null;
  delete globalRef.__whatsappSocket;
  setConnected(false);
  setQR(null);
  _initializing = false;
}

export async function sendWhatsAppMessage(to: string, text: string) {
  const sock = socket || globalRef.__whatsappSocket;
  if (!sock || !isConnected()) {
    throw new Error("WhatsApp no conectado. Escanea el código QR primero.");
  }

  const jid = to.includes("@s.whatsapp.net") ? to : `${to}@s.whatsapp.net`;
  await sock.sendMessage(jid, { text });
}
