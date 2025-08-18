import { Knowns, Unknowns } from "@/modules";

export const fetchAllWords = async () => {
  return await Knowns.Model.getAllWords();
};

export const updateWords = async (word: string) => {
  try {
    const knownsItems: Record<string, Knowns.Type.item> = (await Knowns.Model.getAllWords()) || {};
    const wordObj = knownsItems[word];

    if (wordObj?.word === word) {
      const unknownsItems: Record<string, Unknowns.Type.item> = await Unknowns.Model.getAllWords();
      const unknownsList: Unknowns.Type.item[] = Object.values(unknownsItems);
      unknownsList.push({ ...wordObj, correctNumber: 0 });

      const sortedList = unknownsList.sort((a, b) => b?.frequency - a?.frequency);
      const sortedItemsObj: Record<string, Unknowns.Type.item> = {};

      for (const wordObject of sortedList) {
        sortedItemsObj[wordObject?.word] = { ...wordObject };
      }

      const updatedUnknownsItems = await Unknowns.Model.updateWords(sortedItemsObj);
      if (updatedUnknownsItems) {
        delete knownsItems[wordObj?.word];
        const updatedKnownsItems = await Knowns.Model.updateWords(knownsItems);
        return updatedKnownsItems;
      }
    } else {
      throw new Error("کلمه مورد نظر یافت نشد!");
    }
  } catch (err) {
    throw err;
  }
};
