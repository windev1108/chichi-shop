import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="../plugin/facebook.js"></script>
      </Head>
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
