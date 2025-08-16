import fs from "fs";
import path from "path";

import { Type } from "./unknowns.type";

export const getAllWords = async () => {
  const filePath = path.join(process.cwd(), "src", "db", "unknowns.json");
  const file = fs.readFileSync(filePath, "utf-8");
  const items: Record<string, Type.item> = JSON.parse(file);

  return items;
};

export const getSingleWord = async (word: string) => {
  const filePath = path.join(process.cwd(), "src", "db", "unknowns.json");
  const file = fs.readFileSync(filePath, "utf-8");
  const items: Record<string, Type.item> = JSON.parse(file);
  const item = items[word || ""];

  return item;
};

export const updateCorrectNumber = async (word: string) => {
  const allWords = await getAllWords();
  const wordObj = await getSingleWord(word);

  allWords[wordObj?.word] = { ...wordObj, correctNumber: wordObj?.correctNumber + 1 };

  const filePath = path.join(process.cwd(), "src", "db", "unknowns.json");
  return fs.promises.writeFile(filePath, JSON.stringify(allWords, null, 2), "utf-8");
};
