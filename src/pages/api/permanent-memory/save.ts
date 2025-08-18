import type { NextApiRequest, NextApiResponse } from "next";

import { Knowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "POST") {
    res.status(405);
    res?.end();
  }

  const word: string | null = req?.body?.word || null;

  if (!word) {
    res?.status(400).json({ message: "کلمه نمی‌تواند خالی باشد!" });
    res?.end();
  }

  try {
    const items = await Knowns.Controller.saveWord(word || "");
    res.status(200).json({ message: "عملیات با موفقیت انجام شد!", info: items });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || "" });
  }
}
