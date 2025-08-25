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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchQuestionHandler = () => {
    axios
      .get(`/api/quiz/question`)
      .then((res) => setData({ ...res?.data?.info }))
      .catch((err) => console.log(err));
  };

  const sendAnswerHandler = (word: string, translate: string) => {
    axios
      .post(`/api/quiz/answer`, { word, translate })
      .then((res) => fetchQuestionHandler())
      .catch((err) => console.log(err));
  };

  const saveToKnownsHandler = () => {
    axios
      .post(`/api/permanent-memory/save`, { word: data?.word })
      .then((res) => {
        fetchQuestionHandler();
      })
      .catch((err) => console.log(err));
  };

  const addNewWordHandler = (e: FormEvent<HTMLFormElement>, onClose: () => void) => {
    e.preventDefault();
    axios
      .post(`/api/word/save`, { word: form?.word, translate: form?.translate, frequency: +form?.frequency })
      .then((res) => {
        console.log(res?.data);
        if (onClose) onClose();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchQuestionHandler();
  }, []);

  useEffect(
    () => () => {
      if (!isOpen) setForm(initialState);
    },
    [isOpen]
  );

  return (
    <div className="max-w-6/12 mx-auto">
      <h2>{data?.word}</h2>
      <ul>
        {data?.options.map((item, i) => (
          <li key={i} onClick={() => sendAnswerHandler(data?.word, item)}>
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <button onClick={fetchQuestionHandler}>کلمه جدید</button>
        <button onClick={onOpen}>افزودن کلمه جدید</button>
        <button onClick={saveToKnownsHandler}>انتقال به حافظه دائمی</button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">افزودن لغت</ModalHeader>
              <Form
                onSubmit={(e) => addNewWordHandler(e, onClose)}
                onReset={() => setForm(initialState)}
                className="flex flex-col gap-4"
              >
                <ModalBody className="w-full">
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
                </ModalBody>
                <ModalFooter className="w-full">
                  <div className="w-full flex justify-end gap-2">
                    <Button type="reset" variant="bordered">
                      ریست
                    </Button>
                    <Button color="primary" type="submit">
                      افزودن
                    </Button>
                  </div>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NewWord;
