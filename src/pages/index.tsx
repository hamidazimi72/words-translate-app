import Link from "next/link";

export default function Home() {
  const routes = [
    { title: "شروع آزمون", path: "/quiz" },
    { title: "افزودن لغت جدید", path: "/new-word" },
    { title: "ترجمه واژه‌ها", path: "/translate" },
    { title: "حافظه دائم", path: "/knowns" },
    { title: "تنظیمات", path: "/config" },
  ];

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {routes.map((item, i) => (
        <Link
          key={i}
          href={item?.path}
          className="h-28 bg-sky-500 rounded-lg shadow flex justify-center items-center text-white text-lg cursor-pointer"
        >
          {item?.title}
        </Link>
      ))}
    </div>
  );
}
