import { NextApiRequest, NextApiResponse } from "next";

import { Knowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") {
    res.status(403);
    res?.end();
  }

  const page = req?.query?.page ? +req?.query?.page : 0;
  const limit = req?.query?.limit ? +req?.query?.limit : 0;
  const word = req?.query?.word ? req?.query?.word.toString() : null;

  if (!page || !limit) res.status(400).json({ message: "مقادیر page و limit اجیاری می‌باشد" });

  try {
    const response = await Knowns.Controller.fetchAllWords(page, limit, word);
    res.status(200).json({ message: "", info: response });
  } catch (err) {
    res.status(200).json({ message: "" });
  }
}
