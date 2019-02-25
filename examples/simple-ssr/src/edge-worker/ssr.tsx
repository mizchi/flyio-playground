import url from "url";
import { getInitialState } from "../shared/reducer";
import { ServerStyleSheet } from "styled-components";
import { RootState } from "../shared/reducer";
import React from "react";
import { StaticRouter } from "react-router";
import { App } from "../shared/App";
import ReactDOMServer from "react-dom/server";

export const ssr = async (req: Request, _init: any) => {
  const pathname = url.parse(req.url).pathname as string;
  const initialState = getInitialState(pathname, Date.now());
  const html = renderApp(initialState);
  return new Response(html);
};

function renderApp(state: RootState) {
  const sheet = new ServerStyleSheet();

  const element = sheet.collectStyles(
    <StaticRouter location={state.url}>
      <App {...state} />
    </StaticRouter>
  );

  const contentHtml = ReactDOMServer.renderToString(element);
  const styleTags = sheet.getStyleTags();
  const serializedState = JSON.stringify(state).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <title>flyio-example</title>
  <meta charset="utf-8"/>
  ${styleTags}
</head>
<body>
  <div class="root">${contentHtml}</div>
  <!-- SSR -->
  <script>window.__initialState = ${serializedState};</script>
  <script src="/static/bundle.js"></script>
</body>
</html>
`;
};
