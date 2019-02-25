import React from "react";
import ReactDOM from "react-dom";
import { App } from "../shared/App";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { callRpc } from "../lib/RpcRegistory";

//@ts-ignore
const initialState = window.__initialState;
const root = document.querySelector(".root") as HTMLElement;
ReactDOM.hydrate(
  <BrowserRouter>
    <App {...initialState} />
  </BrowserRouter>,
  root
);

//@ts-ignore
global.axios = axios;
//@ts-ignore
global.callRpc = callRpc;
