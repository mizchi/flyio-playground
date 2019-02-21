import { HNStory } from "../shared/RootState";

export async function getHNStories(): Promise<HNStory[]> {
  const ids: number[] = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  ).then(res => res.json());
  const stroies = await Promise.all(ids.slice(0, 20).map(id => getHNStory(id)));
  return stroies;
}

export async function getHNStory(id: number): Promise<HNStory> {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
    res => res.json()
  );
}
