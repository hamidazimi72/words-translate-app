import { NextApiRequest, NextApiResponse } from "next";

import { Unknowns } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") {
    res.status(403);
    res.end();
  }

  try {
    const response = await Unknowns.Controller.createQuestion();
    res.status(200).json({ info: response, message: "" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}
