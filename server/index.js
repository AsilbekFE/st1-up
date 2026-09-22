import app from "./src/app.js";
import os from "os";

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // barcha interfacelar (Wi-Fi, LAN)

// Mahalliy tarmoq IP manzilini topish
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

app.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`=========================================`);
  console.log(`🚀 EduUZ Backend Server ishga tushdi!`);
  console.log(`📍 Lokal:   http://localhost:${PORT}`);
  console.log(`🌐 Tarmoq:  http://${localIP}:${PORT}`);
  console.log(`🩺 Health:  http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
