// API
import db from "@fly/data";
import { Post } from "../shared/RootState";

type Collection<T> = {
  get(id: string): Promise<T | null>;
  put(id: string, value: T): Promise<void>;
};

const posts: Collection<Post> = db.collection("posts");
const userPostedItems: Collection<string[]> = db.collection("userPostedItems");
const appState: Collection<any> = db.collection("appState");

export async function dropAllCollection() {
  await db.dropCollection("items");
  await db.dropCollection("userPostedItems");
  await db.dropCollection("appState");
}

export async function getPost(id: string): Promise<Post | null> {
  return posts.get(id);
}

export async function getRecentPosts(): Promise<Post[]> {
  const recentIds: any[] = (await appState.get("recentPosts")) || [];
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
