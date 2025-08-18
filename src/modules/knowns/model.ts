import fs from "fs";
import path from "path";

import { Knowns } from "@/modules";

const knownsFilePath = path.join(process.cwd(), "src", process.env?.KNOWNS_FILE_PATH || "");

export const getAllWords = async () => {
  try {
    const dataFile = await fs.promises.readFile(knownsFilePath, "utf-8");
    const items: Record<string, Knowns.Type.item> = JSON.parse(dataFile);
    return items;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const updateWords = async (words: Record<string, Knowns.Type.item>) => {
  try {
    await fs.promises.writeFile(knownsFilePath, JSON.stringify(words, null, 2), "utf-8");
    return words;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};
