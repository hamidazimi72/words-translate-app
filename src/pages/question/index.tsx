import axios from "axios";
import { useEffect, useState } from "react";

const Question = () => {
  const [data, setData] = useState<{ word: string; options: string[] }>();

  const fetchQuestionHandler = () => {
    axios
      .get(`/api/quiz/question`)
      .then((res) => setData({ ...res?.data }))
      .catch((err) => console.log(err));
  };

  const sendAnswerHandler = (word: string, translate: string) => {
    axios
      .post(`/api/quiz/answer`, { word, translate })
      .then((res) => console.log(res?.data))
      .catch((err) => console.log(err))
      .finally(() => fetchQuestionHandler());
  };

  useEffect(() => {
    fetchQuestionHandler();
  }, []);
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

      <button onClick={fetchQuestionHandler}>کلمه جدید</button>
    </div>
  );
};

export default Question;
