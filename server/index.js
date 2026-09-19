import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 EduUZ Backend Server ishga tushdi!`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎓 Universitetlar API: http://localhost:${PORT}/api/universities`);
  console.log(`=========================================`);
});
