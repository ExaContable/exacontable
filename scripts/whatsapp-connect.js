/* eslint-disable @typescript-eslint/no-require-imports */
const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

const AUTH_DIR = path.join(__dirname, "..", "whatsapp-auth");
const QR_SHOWN = new Set();

const logger = pino({ level: "silent" });

function openBrowser(url) {
  const cmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
  exec(`${cmd} "${url}"`, () => {});
}

function printQR(qr) {
  if (QR_SHOWN.has(qr)) return;
  QR_SHOWN.add(qr);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   CONECTAR WHATSAPP - EXA CONTABLE       ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log("  1. Abre WhatsApp en tu telefono");
  console.log("  2. Ve a Dispositivos vinculados");
  console.log("  3. Escanea el QR desde este enlace:\n");
  console.log("  " + qrUrl + "\n");

  openBrowser(qrUrl);
  console.log("  (Se abrio en tu navegador)\n");
  console.log("⏳ Esperando escaneo...\n");
}

async function connect() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const socket = makeWASocket({
    auth: state,
    logger,
    browser: Browsers.windows("Chrome"),
    syncFullHistory: false,
    markOnlineOnConnect: false,
    printQRInTerminal: false,
    generateHighQualityLinkPreview: false,
    shouldSyncHistory: false,
  });

  return new Promise((resolve) => {
    socket.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) printQR(qr);

      if (connection === "open") {
        console.log("\n✅ WhatsApp conectado exitosamente!\n");
        resolve();
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("\n❌ Sesion cerrada desde el telefono. Eliminando auth...\n");
          fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          QR_SHOWN.clear();
          connect().then(resolve);
        } else {
          console.log("\n⚠️  Desconectado, reconectando...\n");
          connect().then(resolve);
        }
      }
    });

    socket.ev.on("creds.update", saveCreds);

    process.on("SIGINT", () => {
      socket?.end(undefined);
      process.exit(0);
    });
  });
}

console.log("\n🔄 Iniciando conexion WhatsApp...\n");

connect()
  .then(() => {
    console.log("📬 Listo para recibir notificaciones de pedidos.\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
