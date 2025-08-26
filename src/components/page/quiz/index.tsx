import { useEffect, useState } from "react";

import axios from "axios";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, Skeleton } from "@heroui/react";

export type QuizProps = {
  boxProps?: React.HTMLAttributes<HTMLDivElement>;
};

export const Quiz: React.FC<QuizProps> = ({ boxProps }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [data, setData] = useState<{ word: string; translate: string; options: string[] }>();
  const [status, setStatus] = useState<"init" | "loading" | "success" | "error">("init");
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);

  const fetchQuestionHandler = () => {
    setStatus("loading");

    axios
      .get(`/api/quiz/question`)
      .then((res) => {
        setStatus("success");
        setData({ ...res?.data?.info });
        setSelected(null);
      })
      .catch((err) => {
        setStatus("error");
      });
  };

  const sendAnswerHandler = (e: any, word: string, translate: string) => {
    setStatus("loading");
    setSelected(translate);
    axios
      .post(`/api/quiz/answer`, { word, translate })
      .then((res) => {
        setStatus("success");
        setTimeout(fetchQuestionHandler, 2000);
      })
      .catch((err) => setStatus("error"));
  };

  const saveToKnownsHandler = () => {
    axios
      .post(`/api/permanent-memory/save`, { word: data?.word })
      .then((res) => {
        setShowTransferModal(false);
        fetchQuestionHandler();
      })
      .catch((err) => console.log(err));
  };

  const setColorHandler = (option: string) => {
    if (selected === null) return "primary";
    if (data?.translate === option) return "success";
    if (data?.translate !== option) return "default";
    return "primary";
  };

  useEffect(() => {
    fetchQuestionHandler();
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col justify-end p-4">
      <div className="h-24 bg-sky-500 rounded-lg shadow flex justify-center items-center text-white text-lg">
        {data?.word}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {status === "loading"
          ? Array(4)
              .fill("")
              .map((item, i) => <Skeleton key={i} className="rounded-lg h-10" isLoaded={false}></Skeleton>)
          : data?.options.map((option, i) => (
              <Button
                key={i}
                color={setColorHandler(option)}
                variant="flat"
                radius="sm"
                onPress={(e) => sendAnswerHandler(e, data?.word, option)}
                disabled={Boolean(selected)}
              >
                {option}
              </Button>
            ))}
      </div>
      <div className="mt-8 flex flex-col gap-2">
        <Button
          color="warning"
          variant="flat"
          radius="sm"
          onPress={fetchQuestionHandler}
          disabled={status === "loading"}
        >
          کلمه جدید
        </Button>
        <Button
          color="success"
          variant="bordered"
          radius="sm"
          onPress={() => setShowTransferModal(true)}
          disabled={status === "loading"}
        >
          انتقال به حافظه دائمی
        </Button>
      </div>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
        }}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="pt-6">
                <span className="text-[16px]">
                  آیا از انتقال کلمه <span className="font-medium">"{data?.word}"</span> به حافظه دائم مطمئن هستید؟
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

export default Quiz;
