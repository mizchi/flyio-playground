import React from "react";
import ReactDOM from "react-dom";
import { App } from "../shared/App";
import { BrowserRouter } from "react-router-dom";

//@ts-ignore
const initialState = window.__initialState;
const root = document.querySelector(".root") as HTMLElement;
ReactDOM.hydrate(
  <BrowserRouter>
    <App {...initialState} />
  </BrowserRouter>,
  root
);
