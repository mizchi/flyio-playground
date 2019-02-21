import React, { useEffect } from "react";
import { getHNStories } from "../../api/hn";
import { useRootState, useDispatch } from "../App";

export function HackerNews() {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const updateStories = async () => {
    const stories = await getHNStories();
    dispatch({
      type: "hn:update-stories",
      payload: {
        stories
      }
    });
  };
  useEffect(() => {
    if (!rootState.page.hn.loaded) {
      updateStories();
    }
  }, []);
  return (
    <div>
      <h2>Hacker News</h2>
      {!rootState.page.hn.loaded && <div>Loading...</div>}
      <div>
        {rootState.page.hn.stories.map(story => {
          return (
            <div key={story.id}>
              <a href={story.url}>{story.title}</a>
            </div>
          );
        })}
        <div>
          <button onClick={updateStories}>reload</button>
        </div>
      </div>
    </div>
  );
}
