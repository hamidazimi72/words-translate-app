import { FormEvent, useEffect, useState } from "react";

import axios from "axios";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Input,
  Button,
} from "@heroui/react";

type formValuesType = { word: string; translate: string; frequency: string };

const initialState = { word: "", translate: "", frequency: "" };

export const NewWord = () => {
  const [data, setData] = useState<{ word: string; options: string[] }>();

  const [form, setForm] = useState<formValuesType>(initialState);

  const fetchQuestionHandler = () => {
    axios
      .get(`/api/quiz/question`)
      .then((res) => setData({ ...res?.data?.info }))
      .catch((err) => console.log(err));
  };

  const addNewWordHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`/api/word/save`, { word: form?.word, translate: form?.translate, frequency: +form?.frequency })
      .then((res) => {
        setForm(initialState);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchQuestionHandler();
  }, []);

  return (
    <div className="w-full flex flex-col justify-end p-4">
      <Form
        onSubmit={(e) => addNewWordHandler(e)}
        onReset={() => setForm(initialState)}
        className="flex flex-col gap-4"
      >
        <Input
          label="لغت (انگلیسی)"
          placeholder="مثال: apple"
          type="text"
          value={form?.word}
          onValueChange={(value) => setForm({ ...form, word: value })}
          labelPlacement="outside"
        />
        <Input
          label="ترجمه (فارسی)"
          placeholder="مثال: سیب"
          type="text"
          value={form?.translate}
          onValueChange={(value) => setForm({ ...form, translate: value })}
          labelPlacement="outside"
        />
        <Input
          label="میزان اهمیت"
          placeholder="از 0 تا 1000 "
          type="text"
          inputMode="numeric"
          value={form?.frequency}
          onValueChange={(value) => setForm({ ...form, frequency: value })}
          labelPlacement="outside"
        />
        <div className="w-full flex justify-end gap-2">
          <Button type="reset" variant="bordered">
            ریست
          </Button>
          <Button color="primary" type="submit">
            افزودن
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewWord;
