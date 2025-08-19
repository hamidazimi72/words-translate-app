import type { NextApiRequest, NextApiResponse } from "next";

import { Unknowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") {
    res.status(405);
    res?.end();
  }

  const size: number = req?.query?.size ? +req?.query?.size.toString() : 0;

  if (!size) {
    res?.status(400).json({ message: "سایز نمی‌تواند خالی باشد!" });
    res?.end();
  }

  try {
    const list = await Unknowns.Controller.fetchWordsWithoutTranslate(size);
    res.status(200).json({ message: "عملیات با موفقیت انجام شد!", info: list });
  } catch (err: any) {
    res.status(400).json({ message: err?.message || "" });
  }
}
