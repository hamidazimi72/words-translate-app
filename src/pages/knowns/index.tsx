import { useEffect, useState } from "react";

import axios from "axios";
import { Button } from "@heroui/react";

import { Knowns as KnownsModules } from "@/modules";

const Knowns = () => {
  const [data, setData] = useState<{ word: string; frequency: number; translate: string }[]>([]);
  const [status, setStatus] = useState<"init" | "loading" | "ok" | "fail">("init");

  const fetchAllDataHandler = () => {
    setStatus("loading");
    axios
      .get(`/api/permanent-memory/fetch-all`)
      .then((res) => {
        const data: KnownsModules.Type.item[] = Object.values(res?.data?.info);
        setData(data);
        setStatus("ok");
      })
      .catch((err) => setStatus("fail"));
  };

  const returnWordHandler = (word: string) => {
    setStatus("loading");
    axios
      .post(`/api/permanent-memory/return-word`, { word })
      .then((res) => {
        setData(Object.values(res?.data?.info));
        // fetchAllDataHandler();
        setStatus("ok");
      })
      .catch((err) => setStatus("fail"));
  };

  useEffect(() => {
    fetchAllDataHandler();
  }, []);
  return (
    <div className="max-w-6/12 mx-auto">
      <ul className="flex flex-col gap-4">
        {data?.map((item, i) => (
          <li key={i} className="flex justify-between items-center gap-2">
            <span>{item?.word}</span>
            <Button onPress={() => returnWordHandler(item?.word)} color="primary">
              بازگردانی
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Knowns;
