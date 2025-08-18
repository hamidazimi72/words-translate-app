import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "POST") {
    res.status(405);
    res?.end();
  }

  const word: string | null = req?.body?.word || null;

  if (!word) res?.status(400).json({ message: "کلمه نمی‌تواند خالی باشد!" });

  try {
    const response = await axios.get(`${process.env.TRANSLATOR_BASE_URI}/get?langpair=en|fa&q=${word}`);
    res.status(200).json({ info: { ...response?.data }, message: "" });
  } catch (err: any) {
    res.status(500).json({ message: err?.message });
  }
}
