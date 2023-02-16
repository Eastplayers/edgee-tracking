import "@/styles/globals.css";
import type { AppProps } from "next/app";
import EdgeeTracking from "../../../lib";

EdgeeTracking.init();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
