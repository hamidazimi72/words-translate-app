import { useEffect, useState } from "react";

import axios from "axios";
import { Button, PressEvent, Skeleton } from "@heroui/react";

export type QuizProps = {
  boxProps?: React.HTMLAttributes<HTMLDivElement>;
};

export const Quiz: React.FC<QuizProps> = ({ boxProps }) => {
  const [data, setData] = useState<{ word: string; translate: string; options: string[] }>();
  const [status, setStatus] = useState<"init" | "loading" | "success" | "error">("init");

  const fetchQuestionHandler = () => {
    setStatus("loading");

    axios
      .get(`/api/quiz/question`)
      .then((res) => {
        setStatus("success");
        setData({ ...res?.data?.info });
      })
      .catch((err) => {
        setStatus("error");
      });
  };

  const sendAnswerHandler = (e: any, word: string, translate: string) => {
    console.log(e?.target);
    // if (data?.translate === e?.target?.innerText) {
    //   console.log("ok");
    // } else {
    //   console.log("fail");
    // }
    // axios
    //   .post(`/api/quiz/answer`, { word, translate })
    //   .then((res) => {
    //     setTimeout(fetchQuestionHandler, 2000);
    //   })
    //   .catch((err) => console.log(err));
  };

  const saveToKnownsHandler = () => {
    axios
      .post(`/api/permanent-memory/save`, { word: data?.word })
      .then((res) => {
        fetchQuestionHandler();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchQuestionHandler();
  }, []);

  return (
    <div className="min-h-[calc(100vh-32px)] flex flex-col justify-end">
      <Skeleton className="rounded-lg" isLoaded={status !== "loading"}>
        <div className="h-24 bg-sky-500 rounded-lg shadow flex justify-center items-center text-white text-lg">
          {data?.word}
        </div>
      </Skeleton>
      <div className="flex flex-col gap-2 mt-4">
        {status === "loading"
          ? Array(4)
              .fill("")
              .map((item, i) => (
                <Skeleton key={i} className="rounded-lg h-10" isLoaded={status !== "loading"}></Skeleton>
              ))
          : data?.options.map((item, i) => (
              <Button
                key={i}
                color="primary"
                variant="flat"
                radius="sm"
                onPress={(e) => sendAnswerHandler(e, data?.word, item)}
              >
                {item}
              </Button>
            ))}
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={fetchQuestionHandler}>کلمه جدید</button>
        <button onClick={saveToKnownsHandler}>انتقال به حافظه دائمی</button>
      </div>
    </div>
  );
};

export default Quiz;
