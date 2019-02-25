import cache from "@fly/cache";
import { Router } from "../../lib/Router";
import { getRecentPosts, addNewPost, getPost } from "../storage";
import { rpc, foo } from "./rpc";

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

router.add(
  "/api/rpc/:name",
  ({ name }: { name: string }) => async (req: Request) => {
    console.log("rpc", name);
    const data = await req.json();
    const result = await rpc.funcMap[name](data);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
);

router.add("/api/test", (_params: {}) => async (req: Request) => {
  return foo({ x: 1 });
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
  await cache.purgeTag("ALL");
  return { purge: "ALL" };
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
