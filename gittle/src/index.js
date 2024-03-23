import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

if (!process.env.NODE_ENV === "production") {
  console.log("asdfasfsafsdfsdfas\nasdfn\n\n\n\n\nasdfsdf")
console.log = function no_console() {};
console.warn = function no_console() {};
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
