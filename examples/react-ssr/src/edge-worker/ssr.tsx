import url from "url";
import { getHNStories } from "../api/hn";
import { reducer, getInitialState } from "../shared/reducer";
import * as actions from "../shared/reducer";
import tags from "./tags.json";
import { getPost } from "./storage";
import { Router } from "../lib/Router";
import { useCacheOrRender, renderApp } from "../lib/useCacheOrRender";

const router = new Router();

router.add<{}>("/", () => async (req: Request) => {
  const pathname = url.parse(req.url).pathname as string;
  const initialState = getInitialState(pathname, Date.now());
  const html = renderApp(initialState);
  return new Response(html);
});

router.add("/post/:id", ({ id }: { id: string }) => async (req: Request) => {
  return useCacheOrRender(req.url, async initialState => {
    const post = await getPost(id);
    if (post) {
      const state = reducer(initialState, actions.setPost(post));
      return {
        status: 200,
        cacheable: true,
        state,
        tags: [tags.ALL]
      };
    } else {
      return {
        status: 404,
        cacheable: false,
        state: initialState,
        tags: [tags.ALL]
      };
    }
  });
});

router.add("/hn", () => async (req: Request) => {
  return useCacheOrRender(req.url, async initialState => {
    const state = reducer(
      initialState,
      actions.updateStories(await getHNStories())
    );
    return {
      status: 200,
      cacheable: true,
      state,
      tags: [tags.ALL]
    };
  });
});

export const ssr = async (req: Request, _init: any) => {
  return router.run(req);
};
