import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

import { MainTemplate } from "@template";

import "@assets/style/font-face.css";
import "@assets/style/app.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <MainTemplate>
        <Component {...pageProps} />
      </MainTemplate>
    </HeroUIProvider>
  );
}
