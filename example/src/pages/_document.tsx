import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
        href="https://unpkg.com/edgee-tracking@1.0.18/lib/bundle.css"
        rel="stylesheet"
        type="text/css"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
