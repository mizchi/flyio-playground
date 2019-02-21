import cache from "@fly/cache";
import db from "@fly/data";
import tags from "./tags.json";
import pathToRegexp from "path-to-regexp";
import url from "url";
import { Post } from "../shared/RootState";

const purge = pathToRegexp("/api/purge");

type Collection<T> = {
  get(id: string): Promise<T | null>;
  put(id: string, value: T): Promise<void>;
};

const posts: Collection<Post> = db.collection("posts");

const userPostedItems: Collection<string[]> = db.collection("userPostedItems");
const appState: Collection<any> = db.collection("appState");
// (async () => {
//   db.dropCollection("items");
//   db.dropCollection("userPostedItems");
//   db.dropCollection("appState");
// })();

function createJsonResponse<T>(json: T) {
  return new Response(JSON.stringify(json), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function api(req: Request) {
  const pathname = url.parse(req.url).pathname as string;
  if (purge.exec(pathname)) {
    await cache.purgeTag(tags.APP_VERSION_TAG);
    return new Response(`purge: ${tags.ALL}`);
  }
  // post /api/recent-posts
  if (pathname === "/api/recent-posts") {
    const recentPosts = await getRecentPosts();
    return createJsonResponse({ recent: recentPosts });
  }
  // post /api/post/:id
  if (pathname.includes("/api/post/")) {
    const id = pathname.replace("/api/post/", "");
    const post = await getPost(id);
    return createJsonResponse({ post });
  }

  if (pathname === "/api/add-item") {
    if (req.body) {
      const data = await req.json();
      const nextState = await addNewPost(data);
      return createJsonResponse(nextState);
    } else {
      return new Response(`not post`, { status: 404 });
    }
  }

  return new Response(`wip`);
}

export async function getPost(id: string): Promise<Post | null> {
  return posts.get(id);
}

export async function getRecentPosts(): Promise<Post[]> {
  const recentIds: any[] = (await appState.get("recentPosts")) || [];
  // console.log(recentIds);
  const recentPosts = await Promise.all(
    recentIds.map(id => {
      return posts.get(id) as Promise<Post>;
    })
  );
  return recentPosts;
}

export async function addNewPost(
  data: Post
): Promise<{ newPost: Post; recent: Post[] }> {
  await posts.put(data.id, data);
  // push posted list
  const postedList = await userPostedItems.get(data.ownerId);
  if (postedList) {
    await userPostedItems.put(data.ownerId, [...postedList, data.id]);
  } else {
    await userPostedItems.put(data.ownerId, [data.id]);
  }

  // push recent items
  let recent = await appState.get("recentPosts");

  if (recent) {
    recent = [data.id, ...recent];
    await appState.put("recentPosts", recent);
  } else {
    recent = [data.id];
    await appState.put("recentPosts", recent);
  }

  return {
    newPost: data,
    recent: await getRecentPosts()
  };
}
