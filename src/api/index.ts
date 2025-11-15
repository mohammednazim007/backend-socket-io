import "tsconfig-paths/register";
import app from "@/app";
import connectDB from "@/config/db";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let dbConnected = false;

// Adapter to make Express callable
function expressHandler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }

  try {
    await expressHandler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
