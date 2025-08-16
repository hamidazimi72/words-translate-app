import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "GET") res.status(403);

  const configFilePath = path.join(process.cwd(), "src", "db", "config.json");
  const configFile = fs.readFileSync(configFilePath, "utf-8");
  const repositoryCurrentWordsNum: number = +JSON.parse(configFile)["repository_current_words_num"];

  const unkownsFilePath = path.join(process.cwd(), "src", "db", "unkowns.json");
  const unkownsFile: string = fs.readFileSync(unkownsFilePath, "utf-8");
  const unkownsItems: { word: string; translate: string; frequency: number; correctNumber: number }[] =
    Object.values(JSON.parse(unkownsFile)) || [];
  const slicedUnkownsItems: { word: string; translate: string; frequency: number; correctNumber: number }[] =
    unkownsItems.slice(0, repositoryCurrentWordsNum) || [];

  const generateRandomIndex = () => Math.floor(Math.random() * slicedUnkownsItems.length);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // ایندکس تصادفی
      [array[i], array[j]] = [array[j], array[i]]; // جابجایی
    }
    return array;
  };

  const wordObj = slicedUnkownsItems[generateRandomIndex()];
  const options: string[] = [];

  // options.push(wordObj?.translate);
  options.push("4");

  for (let i = 0; i < 3; i++) {
    // const obj = slicedUnkownsItems[generateRandomIndex()];
    // const option = obj?.translate;
    const option = (i + 1).toString();
    options.push(option);
  }

  res.status(200).json({ word: wordObj?.word, options: shuffleArray(options) });
}
