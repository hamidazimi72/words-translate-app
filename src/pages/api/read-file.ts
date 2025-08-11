import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "src", "books", "1.txt");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const wordsArr: string[] = fileContent.toLowerCase().match(/[a-z]{3,}/g) || [];

  const frequencyMap: { [key: string]: { word: string; translate: ""; frequency: number; correctNumber: number } } = {};

  for (const word of wordsArr) {
    if (frequencyMap[word]) {
      frequencyMap[word].frequency += 1;
    } else {
      frequencyMap[word] = { word, translate: "", frequency: 1, correctNumber: 0 };
    }
  }

  const sortedArr = Object.values(frequencyMap).sort((a, b) => b?.frequency - a?.frequency);

  const response: { [key: string]: { word: string; translate: string; frequency: number; correctNumber: number } } = {};

  for (const wordObj of sortedArr) {
    response[wordObj?.word] = { ...wordObj };
  }

  const unkownsFilePath = path.join(process.cwd(), "src", "db", "unkowns.json");

  if (!fs.existsSync(unkownsFilePath)) {
    fs.writeFileSync(unkownsFilePath, JSON.stringify({}, null, 2), "utf-8");
  }

  fs.writeFileSync(unkownsFilePath, JSON.stringify(response, null, 2), "utf-8");

  res.status(200).json({ message: "عملیات با موفقیت انجام شد!" });
}
