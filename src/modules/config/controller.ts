import { Config } from "@/modules";

export const fetchAllConfigs = async () => {
  return await Config.Model.getAllConfig();
};

export const updateConfig = async (symbol: string, value: string) => {
  const configs: Record<string, string> = (await Config.Model.getAllConfig()) || {};
  configs[symbol] = value;
  return await Config.Model.updateConfig(configs);
};
