import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const html = (
  <html>
    <head>
      <title>condo investment roi calculator</title>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9765601109946250"
        crossorigin="anonymous"
      ></script>
    </head>
    <body>
      <App />
    </body>
  </html>
);

ReactDOM.render(html, document.getElementById("root"));
