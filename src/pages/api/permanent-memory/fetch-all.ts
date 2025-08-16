import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") {
    res.status(403);
    res?.end();
  }

  const knownsFilePath = path.join(process.cwd(), "src", "db", "knowns.json");
  const knownsFile: string = fs.readFileSync(knownsFilePath, "utf-8");
  const knownsItems: { word: string; translate: string; frequency: number; correctNumber: number }[] =
    Object.values(JSON.parse(knownsFile)) || [];

  res.status(200).json({ message: "", info: [...knownsItems] });
}
