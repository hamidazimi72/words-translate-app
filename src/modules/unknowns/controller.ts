import { Config, Knowns, Unknowns } from "@/modules";

export const createQuestion = async () => {
  try {
    const repositoryCurrentWordsNum: string = await Config.Model.getSingleConfig("repository_current_words_num");
    const unknownsItems = await Unknowns.Model.getAllWords();
    const slicedUnknownsList: Unknowns.Type.item[] =
      Object.values(unknownsItems).slice(0, +repositoryCurrentWordsNum) || [];

    const generateRandomIndex = (length: number) => Math.floor(Math.random() * length);

    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // ایندکس تصادفی
        [array[i], array[j]] = [array[j], array[i]]; // جابجایی
      }
      return array;
    };

    const wordObj = slicedUnknownsList[generateRandomIndex(slicedUnknownsList.length)];
    const options: string[] = [];

    options.push(wordObj?.translate);
    // options.push("4");

    for (let i = 0; i < 3; i++) {
      const obj = slicedUnknownsList[generateRandomIndex(slicedUnknownsList.length)];
      const option = obj?.translate;
      // const option = (i + 1).toString();
      options.push(option);
    }

    return { word: wordObj?.word, translate: "4", options: shuffleArray(options) };
    // return { word: wordObj?.word, translate: wordObj?.translate, options: shuffleArray(options) };
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const checkAnswer = async (word: string, translate: string) => {
  try {
    const wordObj = await Unknowns.Model.getSingleWord(word);

    if (!wordObj) {
      throw new Error("کلمه مورد نظر یافت نشد!");
    }

    // if (wordObj?.translate === translate) {
    if (translate === "4") {
      const correctAnswerNum: string = await Config.Model.getSingleConfig("correct_answer_num");

      if (wordObj?.correctNumber + 1 >= +correctAnswerNum) {
        const knownsItems: Record<string, Knowns.Type.item> = await Knowns.Model.getAllWords();
        const knownWordObj: Knowns.Type.item = {
          word,
          translate: wordObj?.translate,
          frequency: wordObj?.frequency,
        };
        knownsItems[word] = { ...knownWordObj };
        await Knowns.Model.updateWords(knownsItems);

        const unknownsItems: Record<string, Unknowns.Type.item> = await Unknowns.Model.getAllWords();
        delete unknownsItems[word];
        await Unknowns.Model.updateWords(unknownsItems);
      } else {
        await Unknowns.Model.updateCorrectNumber(word);
      }
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const saveWord = async (wordObj: Unknowns.Type.item) => {
  try {
    const response = await Unknowns.Model.saveWord(wordObj);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchWordsWithoutTranslate = async (size: number) => {
  try {
    const list: Unknowns.Type.item[] = await Unknowns.Model.getWordsWithoutTranslate(size);
    return list;
  } catch (error) {}
};

export const setTranslate = async (word: string, translate: string) => {
  try {
    await Unknowns.Model.setTranslate(word, translate);
  } catch (error) {
    throw error;
  }
};
