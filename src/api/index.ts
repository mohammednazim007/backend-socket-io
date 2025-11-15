import "tsconfig-paths/register"; // resolve @/ aliases
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "@/app";
import connectDB from "@/config/db";

let dbConnected = false;

// Express adapter for Vercel serverless
const expressHandler = (req: VercelRequest, res: VercelResponse) =>
  new Promise<void>((resolve, reject) => {
    app(req as any, res as any, (err?: any) => {
      if (err) reject(err);
      else resolve();
    });
  });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }

  try {
    await expressHandler(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    res.status(500).send("Internal Server Error");
  }
}
