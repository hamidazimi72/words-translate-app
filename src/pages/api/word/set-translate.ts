import type { NextApiRequest, NextApiResponse } from "next";

import { Unknowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "POST") {
    res.status(405);
    res?.end();
  }

  const word: string | null = req?.body?.word || null;
  const translate: string | null = req?.body?.translate || null;

  if (!word) {
    res?.status(400).json({ message: "کلمه نمی‌تواند خالی باشد!" });
    res?.end();
  }

  if (!translate) {
    res?.status(400).json({ message: "ترجمه نمی‌تواند خالی باشد!" });
    res?.end();
  }

  try {
    await Unknowns.Controller.setTranslate(word || "", translate || "");
    res.status(200).json({ message: "عملیات با موفقیت انجام شد!", info: null });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || "" });
  }
}
