import "@/styles/globals.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "moment/locale/vi";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Plugin from "@/fb/Plugin";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Plugin />
        <Toaster />
        <NextNProgress color="#377dff" options={{ showSpinner: false }} />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
