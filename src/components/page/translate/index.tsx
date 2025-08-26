import { useEffect, useState } from "react";

import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@heroui/react";

import { Unknowns } from "@/modules";

interface DTO_translator_item {
  responseData: { translatedText: string; match: number };
  quotaFinished: boolean;
  mtLangSupported: string | number | null;
  responseDetails: string;
  responseStatus: number;
  responderId: number | null;
  exception_code: number | null;
  matches: {
    id: string;
    segment: string;
    translation: string;
    source: string;
    target: string;
    quality: string | number;
    reference: null;
    "usage-count": number;
    subject: string;
    "created-by": string;
    "last-updated-by": string;
    "create-date": string;
    "last-update-date": string;
    match: number;
    penalty: number;
  }[];
}

export const Translate = () => {
  const [list, setList] = useState<Unknowns.Type.item[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [translate, setTranslate] = useState<string>("");
  const [selectedTransferItem, setSelectedTransferItem] = useState<Unknowns.Type.item | null>(null);

  const fetchWordsHandler = () => {
    axios
      .get(`/api/word/without-translate?size=10`)
      .then((res) => {
        setList(res?.data?.info);
      })
      .catch((err) => console.log(err));
  };

  const saveToKnownsHandler = () => {
    axios
      .post(`/api/permanent-memory/save`, { word: selectedTransferItem?.word })
      .then((res) => {
        fetchWordsHandler();
        setSelectedTransferItem(null);
      })
      .catch((err) => console.log(err));
  };

  const translateHandler = async () => {
    try {
      const res = await axios.post("/api/translator/en-to-fa", {
        word: selectedWord,
      });
      const data: { message: string; info: DTO_translator_item } = res?.data;
      const options = data?.info?.matches?.map((item) => item?.translation);
      setOptions(options);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const setTranslateHandler = async (onClose: () => void) => {
    try {
      await axios.post("/api/word/set-translate", { word: selectedWord, translate });
      if (onClose) {
        onClose();
        fetchWordsHandler();
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    fetchWordsHandler();
  }, []);

  useEffect(() => {
    if (selectedWord) translateHandler();
  }, [selectedWord]);

  return (
    <div className="w-full p-4">
      <ul className="flex flex-col gap-4">
        {list.map((item, i) => {
          return (
            <li key={i} className="flex justify-between gap-4 items-center">
              <span>{item?.word}</span>
              <div className="flex gap-2">
                <Button color="primary" variant="flat" onPress={() => setSelectedWord(item?.word)}>
                  ترجمه
                </Button>
                <Button color="success" variant="flat" onPress={() => setSelectedTransferItem(item)}>
                  حافظه دائم
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Modal
        isOpen={Boolean(selectedWord)}
        onClose={() => {
          setOptions([]);
          setTranslate("");
          setSelectedWord(null);
        }}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">انتخاب ترجمه</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  {options?.map((item, i) => (
                    <Button key={i} color="primary" variant="flat" onPress={() => setTranslate(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
                <Input
                  type="text"
                  value={translate}
                  onValueChange={(value) => setTranslate(value)}
                  labelPlacement="outside"
                />
              </ModalBody>
              <ModalFooter className="w-full">
                <div className="w-full flex justify-end gap-2">
                  <Button variant="bordered" onPress={onClose}>
                    بازگشت
                  </Button>
                  <Button color="primary" onPress={() => setTranslateHandler(onClose)}>
                    ترجمه
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={Boolean(selectedTransferItem)}
        onClose={() => {
          setSelectedTransferItem(null);
        }}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="pt-6">
                <span className="text-[16px]">
                  آیا از انتقال کلمه <span className="font-medium">"{selectedTransferItem?.word}"</span> به حافظه دائم
                  مطمئن هستید؟
                </span>
              </ModalBody>
              <ModalFooter className="w-full">
                <div className="w-full flex justify-end gap-2">
                  <Button color="success" variant="flat" onPress={saveToKnownsHandler}>
                    انتقال
                  </Button>
                  <Button variant="bordered" onPress={onClose}>
                    بازگشت
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Translate;
