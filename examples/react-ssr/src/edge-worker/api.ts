import cache from "@fly/cache";
import tags from "./tags.json";
import { Router } from "../lib/Router";
import { getRecentPosts, addNewPost, getPost } from "./storage";

const router = new Router({
  async postAction(result: Response | object) {
    if (result instanceof Response) {
      return result;
    } else {
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    }
  }
});

router.add("/api/test", (_params: {}) => async (req: Request) => {
  const data = await fetch("http://127.0.0.1/api/recent-posts");
  return data;
});

router.add("/api/recent-posts", (_params: {}) => async (req: Request) => {
  const recentPosts = await getRecentPosts();
  return { recent: recentPosts };
});

router.add("/api/add-item", (_params: {}) => async (req: Request) => {
  if (req.body) {
    const data = await req.json();
    const nextState = await addNewPost(data);
    return nextState;
  } else {
    return new Response(`not post`, { status: 404 });
  }
});

router.add("/api/purge", (_params: {}) => async (req: Request) => {
  await cache.purgeTag(tags.APP_VERSION_TAG);
  return { purge: tags.ALL };
});

router.add(
  "/api/post/:id",
  ({ id }: { id: string }) => async (req: Request) => {
    console.log("fetch with", id);
    const post = await getPost(id);
    return { post };
  }
);

export async function api(req: Request) {
  const result = router.run(req);
  if (result instanceof Promise) {
    return await result;
  } else {
    return new Response(`wip`, { status: 404 });
  }
}
