import fs from "fs";
import path from "path";

const configFilePath = path.join(process.cwd(), "src", process.env?.CONFIG_FILE_PATH || "");

export const getAllConfig = async () => {
  try {
    const dataFile = await fs.promises.readFile(configFilePath, "utf-8");
    const configs: Record<string, string> = JSON.parse(dataFile);
    return configs;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const getSingleConfig = async (symbol: string) => {
  try {
    const configs: Record<string, string> = (await getAllConfig()) || {};
    const config: string = configs[symbol];
    return config;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const updateConfig = async (configs: Record<string, string>) => {
  try {
    await fs.promises.writeFile(configFilePath, JSON.stringify(configs, null, 2), "utf-8");
    return configs;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};
