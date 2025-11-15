import "tsconfig-paths/register";
import app from "@/app";
import connectDB from "@/config/db";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let dbConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  app(req, res);
}
