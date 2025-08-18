import { NextApiRequest, NextApiResponse } from "next";

import { Knowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") {
    res.status(403);
    res?.end();
  }

  try {
    const items = await Knowns.Controller.fetchAllWords();
    res.status(200).json({ message: "", info: items });
  } catch (err) {
    res.status(200).json({ message: "" });
  }
}
