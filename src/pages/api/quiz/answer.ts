import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== "POST") {
    res.status(405);
    res?.end();
  }

  const word: string | null = req?.body?.word || null;
  const translate: string | null = req?.body?.translate || null;

  if (!word) res?.status(400).json({ message: "کلمه نمی‌تواند خالی باشد!" });
  if (!translate) res?.status(400).json({ message: "ترجمه نمی‌تواند خالی باشد!" });

  const unkownsFilePath = path.join(process.cwd(), "src", "db", "unkowns.json");
  const unkownsFile = fs.readFileSync(unkownsFilePath, "utf-8");
  const unkownsItems: { [key: string]: { word: string; translate: string; frequency: number; correctNumber: number } } =
    JSON.parse(unkownsFile);
  const wordObj = unkownsItems[word || ""];

  // if(wordObj?.word === word && wordObj?.translate === translate) {
  if (wordObj?.word === word && translate === "4") {
    const configFilePath = path.join(process.cwd(), "src", "db", "config.json");
    const configFile = fs.readFileSync(configFilePath, "utf-8");
    const correctAnswerNum: number = +JSON.parse(configFile)["correct_answer_num"];

    if (wordObj?.correctNumber + 1 >= correctAnswerNum) {
      const knownsFilePath = path.join(process.cwd(), "src", "db", "knowns.json");

      if (!fs.existsSync(knownsFilePath)) {
        fs.promises.writeFile(knownsFilePath, JSON.stringify({}, null, 2), "utf-8");
      }

      fs.promises
        .writeFile(
          knownsFilePath,
          JSON.stringify({ [word]: { word: wordObj?.word, frequency: wordObj?.frequency, translate: "" } }, null, 2),
          "utf-8"
        )
        .then(() => {
          delete unkownsItems[word];

          fs.promises
            .writeFile(unkownsFilePath, JSON.stringify(unkownsItems, null, 2), "utf-8")
            .then(() => {
              res.status(200).json({ correct: true, message: "پاسخ صحیح است" });
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    } else {
      unkownsItems[word] = { ...wordObj, correctNumber: wordObj?.correctNumber + 1 };

      fs.promises
        .writeFile(unkownsFilePath, JSON.stringify(unkownsItems, null, 2), "utf-8")
        .then(() => {
          res.status(200).json({ correct: true, message: "پاسخ صحیح است" });
        })
        .catch((err) => {});
    }
  } else {
    res.status(200).json({ correct: false, message: "گزینه ناردست است!" });
  }
}
