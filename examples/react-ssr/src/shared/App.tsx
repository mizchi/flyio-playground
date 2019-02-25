import React, { Dispatch, useContext, useReducer, useState } from "react";
import { Route, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Action, reducer } from "./reducer";
import { RootState } from "./RootState";
import { HackerNews } from "./components/HackerNews";
import { Index } from "./components/Index";
import { Post as PostComponent } from "./components/Post";
import { Header } from "./components/Header";
import { Counter } from "./components/Counter";

export const RootContext = React.createContext<RootState>(null as any);
export const DispatchContext = React.createContext<Dispatch<Action>>(
  null as any
);

export function useRootState(): RootState {
  return useContext(RootContext);
}

export function useDispatch() {
  return useContext(DispatchContext);
}

export function App(props: RootState) {
  const [rootState, dispatch] = useReducer(reducer, props);

  return (
    // ssr warning
    <RootContext.Provider value={rootState}>
      <DispatchContext.Provider value={dispatch}>
        <RootContainer suppressHydrationWarning={true}>
          <RootContent suppressHydrationWarning={true}>
            <GlobalStyle />
            <Header {...props} />
            <Switch>
              <Route exact path="/counter" component={Counter} />
              <Route exact path="/hn" component={HackerNews} />
              <Route exact path="/post/:id" component={PostComponent} />
              <Route exact path="/" component={Index} />
            </Switch>
          </RootContent>
        </RootContainer>
      </DispatchContext.Provider>
    </RootContext.Provider>
  );
}

const GlobalStyle = createGlobalStyle`
  html, body, .root {
    padding: 0;
    margin: 0;
  }
  body {
    background-color: #eee;
  }

  * {
    box-sizing: border-box;
  }
`;

const RootContainer = styled.div`
  width: 100%;
`;

const RootContent = styled.div`
  padding: 10px;
`;
