import { NextApiRequest, NextApiResponse } from "next";

import { Config } from "@/modules";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") res.status(403);

  try {
    const configs = await Config.Controller.fetchAllConfigs();
    res.status(200).json({ info: configs, message: "" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}
