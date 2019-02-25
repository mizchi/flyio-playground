import React, { Dispatch, useContext, useReducer, useState, useCallback } from "react";
import { Route, Switch, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Action, reducer, RootState } from "./reducer";
import * as actions from "./reducer";

// RootState context

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

// Header

export const HEADER_LINKS: { name: string; path: string }[] = [
  {
    name: "Index",
    path: "/"
  },
  {
    name: "Counter",
    path: "/counter"
  }
];

function Header(props: RootState) {
  return (
    <header suppressHydrationWarning={true}>
      <h1>SSR on fly.io playground</h1>
      <div>generated {props.timestamp}</div>
      {HEADER_LINKS.map(link => {
        return (
          <span key={link.path}>
            <Link to={link.path}>{link.name}</Link>
            |&nbsp;
          </span>
        );
      })}
    </header>
  );
}

// Index

function Index() {
 return (
    <div>
      <h1>Index</h1>
    </div>
  );
}

// Counter
function Counter() {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const onClickIncrement = useCallback(() => dispatch(actions.increment()), []);
  const onClickDecrement = useCallback(() => dispatch(actions.decrement()), []);
  return (
    <div>
      <h2>Counter</h2>
      <button onClick={onClickIncrement}>+1</button>
      <button onClick={onClickDecrement}>-1</button>
      <div>value: {rootState.page.counter.value}</div>
    </div>
  );
}
