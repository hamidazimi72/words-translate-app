import type { NextApiRequest, NextApiResponse } from "next";

import { Config } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "PUT") {
    res.status(405);
    res?.end();
  }

  const symbol: string | null = req?.body?.symbol || null;
  const value: string | null = req?.body?.value || null;

  if (!symbol) res?.status(400).json({ message: "نوع تنظیم نمی‌تواند خالی باشد!" });
  if (!value) res?.status(400).json({ message: "مقدار تنظیم نمی‌تواند خالی باشد!" });

  try {
    const configs = await Config.Controller.updateConfig(symbol || "", value || "");
    res.status(200).json({ info: configs, message: "تنظیمات با موفقیت بروزرسانی شد!" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}
