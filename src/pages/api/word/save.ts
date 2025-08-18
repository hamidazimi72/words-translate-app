import type { NextApiRequest, NextApiResponse } from "next";

import { Unknowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "POST") {
    res.status(405);
    res?.end();
  }

  const word: string | null = req?.body?.word || null;
  const translate: string | null = req?.body?.translate || null;
  const frequency: string | null = req?.body?.frequency || null;
  const correctNumber: number = 0;

  if (!word) {
    res?.status(400).json({ message: "کلمه نمی‌تواند خالی باشد!" });
    res?.end();
  }

  if (!translate) {
    res?.status(400).json({ message: "ترجمه نمی‌تواند خالی باشد!" });
    res?.end();
  }

  if (!frequency) {
    res?.status(400).json({ message: "تعداد تکرار نمی‌تواند خالی باشد!" });
    res?.end();
  }

  const wordObj = {
    word: word || "",
    translate: translate || "",
    frequency: frequency ? +frequency : 0,
    correctNumber,
  };

  try {
    const items = await Unknowns.Controller.saveWord(wordObj);
    res.status(200).json({ message: "عملیات با موفقیت انجام شد!", info: items });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || "" });
  }
}
