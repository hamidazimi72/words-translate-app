import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") res.status(403);

  const configFilePath = path.join(process.cwd(), "src", "db", "config.json");
  const configFile = fs.readFileSync(configFilePath, "utf-8");

  res.status(200).json({ ...JSON.parse(configFile) });
}
