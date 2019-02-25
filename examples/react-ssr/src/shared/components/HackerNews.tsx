import React, { useEffect, Dispatch } from "react";
import { getHNStories } from "../../edge-worker/api/hn";
import { useRootState, useDispatch } from "../App";
import { Action } from "../reducer";

type UniversalContext = {
  host: string;
  dispatch: Dispatch<Action>;
};

export async function getInitialProps(context: UniversalContext) {
  const stories = await getHNStories();
  context.dispatch({
    type: "hn:update-stories",
    payload: {
      stories
    }
  });
}

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
