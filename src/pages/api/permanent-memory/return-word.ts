import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "POST") {
    res.status(405);
    res?.end();
  }

  const word: string | null = req?.body?.word || null;

  if (!word) {
    res?.status(400).json({ message: "کلمه نمی‌تواند خالی باشد!" });
    res?.end();
  }

  const knownsFilePath = path.join(process.cwd(), "src", "db", "knowns.json");
  const knownsFile = fs.readFileSync(knownsFilePath, "utf-8");
  const knownsItems: { [key: string]: { word: string; translate: string; frequency: number; correctNumber: number } } =
    JSON.parse(knownsFile);
  const wordObj = knownsItems[word || ""];

  if (wordObj?.word === word) {
    const unknownsFilePath = path.join(process.cwd(), "src", "db", "unkowns.json");
    const unknownsFile = fs.readFileSync(unknownsFilePath, "utf-8");
    const unknownsItems: { word: string; translate: string; frequency: number; correctNumber: number }[] =
      Object.values(JSON.parse(unknownsFile));
    unknownsItems.push({ ...wordObj, correctNumber: 0 });

    const sortedItems = unknownsItems.sort((a, b) => b?.frequency - a?.frequency);
    const sortedItemsObj: {
      [key: string]: { word: string; translate: string; frequency: number; correctNumber: number };
    } = {};

    for (const wordObj of sortedItems) {
      sortedItemsObj[wordObj?.word] = { ...wordObj };
    }

    fs.promises
      .writeFile(unknownsFilePath, JSON.stringify({ ...sortedItemsObj }, null, 2), "utf-8")
      .then(() => {
        delete knownsItems[word];

        fs.promises
          .writeFile(knownsFilePath, JSON.stringify(knownsItems, null, 2), "utf-8")
          .then(() => {
            res.status(200).json({ message: `بازگردانی کلمه ${word} با موفقیت انجام شد!` });
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  } else {
    res.status(200).json({ correct: false, message: "کلمه یافت نشد!" });
  }
}
