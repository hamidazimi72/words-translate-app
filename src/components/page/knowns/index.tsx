import { useEffect, useState } from "react";

import axios from "axios";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { Knowns as KnownsModules } from "@/modules";

export const Knowns = () => {
  const [data, setData] = useState<{ word: string; frequency: number; translate: string }[]>([]);
  const [status, setStatus] = useState<"init" | "loading" | "ok" | "fail">("init");
  const [selectedItem, setSelectedItem] = useState<KnownsModules.Type.item | null>(null);

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

  const returnWordHandler = () => {
    setStatus("loading");
    axios
      .post(`/api/permanent-memory/return-word`, { word: selectedItem?.word })
      .then((res) => {
        setData(Object.values(res?.data?.info));
        // fetchAllDataHandler();
        setStatus("ok");
        setSelectedItem(null);
      })
      .catch((err) => setStatus("fail"));
  };

  useEffect(() => {
    fetchAllDataHandler();
  }, []);

  return (
    <div className="p-4">
      <ul className="flex flex-col gap-4">
        {data?.map((item, i) => (
          <li key={i} className="flex justify-between items-center gap-2">
            <span>{item?.word}</span>
            <Button onPress={() => setSelectedItem(item)} color="primary">
              بازگردانی
            </Button>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => {
          setSelectedItem(null);
        }}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>بازگردانی</ModalHeader>
              <ModalBody>
                <span className="text-[16px]">
                  آیا از بازگردانی کلمه <span className="font-medium">"{selectedItem?.word}"</span> به لیست کلمه‌ها
                  مطمئن هستید؟
                </span>
              </ModalBody>
              <ModalFooter className="w-full">
                <div className="w-full flex justify-end gap-2">
                  <Button color="primary" variant="flat" onPress={returnWordHandler}>
                    بازگردانی
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

export default Knowns;
