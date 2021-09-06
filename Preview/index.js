// 入口文件
import { createApp } from "./core/index.js";
import App from "./App.js";
const css = `
.test {
    background-color: #888;
    color: white;
  }
`;
createApp(App).mount("app", css);
