import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import app from "./app";
import http from "http";
import { initSocket } from "@/socket/socket-io";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();
