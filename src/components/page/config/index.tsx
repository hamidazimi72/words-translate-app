import { useEffect, useState } from "react";

import axios from "axios";
import { Input } from "@heroui/react";

export const Config = () => {
  const [data, setData] = useState<{ repository_current_words_num?: string; correct_answer_num?: string }>({
    correct_answer_num: "",
    repository_current_words_num: "",
  });

  const fetchAllConfigHandler = () => {
    axios
      .get(`/api/config/fetch-all`)
      .then((res) => setData({ ...res?.data?.info }))
      .catch((err) => console.log(err));
  };

  const updateSingleConfigHandler = (symbol: string, value: string) => {
    axios
      .put(`/api/config/update`, { symbol, value })
      .then((res) => setData({ ...res?.data?.info }))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAllConfigHandler();
  }, []);

  return (
    <div className="p-4">
      {/* <div> */}
      <Input
        label="تعداد کلمات جاری در مخزن"
        labelPlacement="outside-top"
        value={data?.repository_current_words_num}
        onChange={(e) => setData({ ...data, repository_current_words_num: e?.target?.value })}
      />
      {/* <label>تعداد کلمات جاری در مخزن</label>
        <input
          value={data?.repository_current_words_num}
          onChange={(e) => setData({ ...data, repository_current_words_num: e?.target?.value })}
        /> */}
      <button
        disabled={!data?.repository_current_words_num}
        onClick={() =>
          updateSingleConfigHandler("repository_current_words_num", data?.repository_current_words_num || "")
        }
      >
        ویرایش
      </button>
      <Input
        label="تعداد پاسخ صحیح جهت انتقال کلمه به حافظه دائم"
        labelPlacement="outside-top"
        value={data?.correct_answer_num}
        onChange={(e) => setData({ ...data, correct_answer_num: e?.target?.value })}
      />
      {/* </div> */}
      {/* <br /> */}
      {/* <div> */}
      {/* <label>تعداد پاسخ صحیح جهت انتقال کلمه به حافظه دائم</label>
        <input
          value={data?.correct_answer_num}
          onChange={(e) => setData({ ...data, correct_answer_num: e?.target?.value })}
        /> */}
      <button
        disabled={!data?.correct_answer_num}
        onClick={() => updateSingleConfigHandler("correct_answer_num", data?.correct_answer_num || "")}
      >
        ویرایش
      </button>
      {/* </div> */}
    </div>
  );
};

export default Config;
