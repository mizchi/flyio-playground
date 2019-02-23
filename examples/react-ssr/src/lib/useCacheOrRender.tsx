import cache from "@fly/cache";
import { RootState } from "../shared/RootState";
import { getInitialState } from "../shared/reducer";
import React from "react";
import { App } from "../shared/App";
import { StaticRouter } from "react-router";
import ReactDOMServer from "react-dom/server";
import url from "url";
import { ServerStyleSheet } from "styled-components";

type CacheableRenderResult<S> = {
  cacheable: boolean;
  status?: number;
  state: S;
  tags?: string[];
};

export async function useCacheOrRender(
  endpoint: string,
  renderAction: (
    initialState: RootState
  ) =>
    | Promise<CacheableRenderResult<RootState>>
    | CacheableRenderResult<RootState>
) {
  const cached = await cache.getString(endpoint);
  const pathname = url.parse(endpoint).pathname as string;
  const initialState = getInitialState(pathname, Date.now());
  if (cached != null) {
    console.log("--- use cache for", endpoint, cached.length);
    return new Response(cached);
  } else {
    // render and cache
    console.log("--- create cache");
    const { state, cacheable, tags } = await renderAction(initialState);
    const html = renderApp(state);
    if (cacheable !== false) {
      await cache.set(endpoint, html, {
        tags
      });
    }
    return new Response(html);
  }
}

export const renderApp = (state: RootState) => {
  const sheet = new ServerStyleSheet();

  const element = sheet.collectStyles(
    <StaticRouter location={state.url}>
      <App {...state} />
    </StaticRouter>
  );

  const contentHtml = ReactDOMServer.renderToString(element);
  const styleTags = sheet.getStyleTags();
  const serializedState = JSON.stringify(state).replace(/</g, "\\u003c");
  return `
<!DOCTYPE html>
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
