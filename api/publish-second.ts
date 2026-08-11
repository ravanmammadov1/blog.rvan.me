import type { VercelRequest, VercelResponse } from "@vercel/node";
import { executePublishSecondPost } from "./linkedin/pipeline";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await executePublishSecondPost();
    console.log("Daily second post execution result:", result);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Failed to execute daily second post pipeline:", err);
    return res.status(500).json({ error: err.message || "Failed to publish second post" });
  }
}
