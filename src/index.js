import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import Moralis from "moralis";

const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URI;
const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;

Moralis.start({ serverUrl, appId });
ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl={serverUrl} appId={appId}>
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
