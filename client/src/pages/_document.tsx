import { Html, Head, Main, NextScript } from "next/document";
import Plugin from "@/fb/Plugin"
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Plugin />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
