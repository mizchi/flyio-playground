import cache from "@fly/cache";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { ServerStyleSheet } from "styled-components";
import url from "url";
import { getHNStories } from "../api/hn";
import { App } from "../shared/App";
import { reducer, getInitialState } from "../shared/reducer";
import * as actions from "../shared/reducer";
import { RootState } from "../shared/RootState";
import tags from "./tags.json";
import { getPost } from "./storage";
import { Router } from "../lib/Router";

const router = new Router({
  // postAction: async t => {
  //   return t;
  // }
});

router.add<{}>("/", () => async (req: Request) => {
  const pathname = url.parse(req.url).pathname as string;
  const initialState = getInitialState(pathname, Date.now());
  const state = initialState;
  const html = render(state);
  return new Response(html);
});

router.add("/post/:id", ({ id }: { id: string }) => async (req: Request) => {
  const pathname = url.parse(req.url).pathname as string;
  const initialState = getInitialState(pathname, Date.now());

  const cached = await cache.getString(req.url);
  if (cached != null) {
    console.log("--- use cache for", req.url, cached.length);
    return new Response(cached);
  } else {
    // render and cache
    console.log("--- create cache");
    const post = await getPost(id);

    if (post) {
      const state = reducer(initialState, actions.setPost(post));
      const html = render(state);
      await cache.set(req.url, html, {
        tags: ["Item", tags.ALL]
      });
      return new Response(html);
    } else {
      // 404
      const html = render(initialState);
      return new Response(html, { status: 404 });
    }
  }
});

router.add("/hn", () => async (req: Request) => {
  const pathname = url.parse(req.url).pathname as string;
  const initialState = getInitialState(pathname, Date.now());

  const cached = await cache.getString(req.url);
  if (cached != null) {
    console.log("--- use cache for", req.url, cached.length);
    return new Response(cached);
  } else {
    console.log("--- create cache");
    // build
    const state = reducer(
      initialState,
      actions.updateStories(await getHNStories())
    );

    const html = render(state);
    await cache.set(req.url, html, {
      tags: [tags.ALL]
    });
    // cache 1 hour
    await cache.expire(req.url, 60 * 60);
    return new Response(html);
  }
});

export const ssr = async (req: Request, _init: any) => {
  return router.run(req);
};

const render = (state: RootState) => {
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
