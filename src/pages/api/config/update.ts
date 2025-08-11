import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "PUT") {
    res.status(405);
    res?.end();
  }

  const symbol: string | null = req?.body?.symbol || null;
  const value: string | null = req?.body?.value || null;

  if (!symbol) res?.status(400).json({ message: "نوع تنظیم نمی‌تواند خالی باشد!" });
  if (!value) res?.status(400).json({ message: "مقدار تنظیم نمی‌تواند خالی باشد!" });

  const configFilePath = path.join(process.cwd(), "src", "db", "config.json");
  const configFile = fs.readFileSync(configFilePath, "utf-8");

  const updatedConfigFile = { ...JSON.parse(configFile), [symbol || ""]: value };

  fs.promises
    .writeFile(configFilePath, JSON.stringify(updatedConfigFile, null, 2), "utf-8")
    .then(() => {
      res.status(200).json({ message: "عملیات با موفقیت انجام شد!" });
    })
    .catch((err) => {});
}
