/* eslint-disable class-methods-use-this */
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link href="/static/styles/semantic.min.css" rel="stylesheet" />
        </Head>
        <body>
          <div className="ui container">
            <Main />
            <NextScript />
          </div>
        </body>
      </html>
    );
  }
}
