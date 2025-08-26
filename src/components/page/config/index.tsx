import { useEffect, useState } from "react";

import axios from "axios";
import { addToast, Button, Input, toast } from "@heroui/react";

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
      .then((res) => {
        setData({ ...res?.data?.info });
        addToast({ title: res?.data?.message, color: "success", variant: "flat" });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAllConfigHandler();
  }, []);

  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <Input
          label="تعداد کلمات جاری در مخزن"
          labelPlacement="outside-top"
          value={data?.repository_current_words_num}
          onChange={(e) => setData({ ...data, repository_current_words_num: e?.target?.value })}
        />
        <Button
          color="primary"
          variant="flat"
          disabled={!data?.repository_current_words_num}
          onPress={() =>
            updateSingleConfigHandler("repository_current_words_num", data?.repository_current_words_num || "")
          }
        >
          ویرایش
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <Input
          label="پاسخ صحیح جهت انتقال کلمه به حافظه دائم"
          labelPlacement="outside-top"
          value={data?.correct_answer_num}
          onChange={(e) => setData({ ...data, correct_answer_num: e?.target?.value })}
        />
        <Button
          color="primary"
          variant="flat"
          disabled={!data?.correct_answer_num}
          onPress={() => updateSingleConfigHandler("correct_answer_num", data?.correct_answer_num || "")}
        >
          ویرایش
        </Button>
      </div>
    </div>
  );
};

export default Config;
