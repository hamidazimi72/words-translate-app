import fs from "fs";
import path from "path";

import { Unknowns } from "@/modules";

const unknownsFilePath = path.join(process.cwd(), "src", process.env?.UNKNOWNS_FILE_PATH || "");

export const getAllWords = async () => {
  try {
    const dataFile = await fs.promises.readFile(unknownsFilePath, "utf-8");
    const items: Record<string, Unknowns.Type.item> = JSON.parse(dataFile);
    return items;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const getSingleWord = async (word: string) => {
  try {
    const items: Record<string, Unknowns.Type.item> = await getAllWords();
    const item = items[word || ""];
    return item;
  } catch (err) {
    throw err;
  }
};

export const updateCorrectNumber = async (word: string) => {
  try {
    const allWords = await getAllWords();
    const wordObj = await getSingleWord(word);

    allWords[wordObj?.word] = { ...wordObj, correctNumber: wordObj?.correctNumber + 1 };

    await fs.promises.writeFile(unknownsFilePath, JSON.stringify(allWords, null, 2), "utf-8");
  } catch (err: any) {
    throw err;
  }
};

export const updateWords = async (words: Record<string, Unknowns.Type.item>) => {
  try {
    fs.promises.writeFile(unknownsFilePath, JSON.stringify(words, null, 2), "utf-8");
    return words;
  } catch (err: any) {
    throw err;
  }
};
