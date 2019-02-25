import { getHNStories } from "./hn";
import { RpcRegistory } from "../../lib/RpcRegistory";
import { getPost } from "../storage";

export const rpc = new RpcRegistory();

export const foo = rpc.register<{ x: number }, { x: number; y: number }>(
  "foo",
  async (params: { x: number }) => {
    return {
      x: params.x,
      y: 3
    };
  }
);

export const hn = rpc.register("hn", async () => {
  return getHNStories();
});

export const getP = rpc.register("get-post", async ({ id }: { id: string }) => {
  const post = await getPost(id);
  return { post };
});
