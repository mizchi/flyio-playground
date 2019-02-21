import { RootState, HNStory, Post } from "./RootState";

export type IncrementAction = {
  type: "counter:increment";
};

export type DecrementAction = {
  type: "counter:decrement";
};

export type InitAction = {
  type: "init";
  payload: {
    url: string;
    timestamp: number;
  };
};

export type UpdateStoriesAction = {
  type: "hn:update-stories";
  payload: {
    stories: HNStory[];
  };
};
export type SetPostAction = {
  type: "post:set-post";
  payload: {
    post: Post;
  };
};

export type Action =
  | InitAction
  | UpdateStoriesAction
  | IncrementAction
  | SetPostAction
  | DecrementAction;

export function increment(): IncrementAction {
  return { type: "counter:increment" };
}

export function decrement(): DecrementAction {
  return { type: "counter:decrement" };
}

export function init(url: string, timestamp: number): InitAction {
  return {
    type: "init",
    payload: { url, timestamp }
  };
}

export function setPost(post: Post): SetPostAction {
  return {
    type: "post:set-post",
    payload: {
      post
    }
  };
}

export function updateStories(stories: HNStory[]): UpdateStoriesAction {
  return {
    type: "hn:update-stories",
    payload: {
      stories
    }
  };
}

export function reducer(state: RootState, action: Action): RootState {
  switch (action.type) {
    case "hn:update-stories": {
      return {
        ...state,
        page: {
          ...state.page,
          hn: {
            loaded: true,
            stories: action.payload.stories
          }
        }
      };
    }
    case "post:set-post": {
      const newPost = action.payload.post;
      return {
        ...state,
        resources: {
          ...state.resources,
          posts: {
            [newPost.id]: newPost
          }
        },
        page: {
          ...state.page
        }
      };
    }
    case "counter:increment": {
      return {
        ...state,
        page: {
          ...state.page,
          counter: { value: state.page.counter.value + 1 }
        }
      };
    }
    case "counter:decrement": {
      return {
        ...state,
        page: {
          ...state.page,
          counter: { value: state.page.counter.value - 1 }
        }
      };
    }
    case "init": {
      return {
        ...state,
        url: action.payload.url,
        timestamp: action.payload.timestamp
      };
    }
    default: {
      return state;
    }
  }
}

export function getInitialState(url: string, timestamp: number): RootState {
  return {
    url,
    timestamp,
    resources: {
      posts: {}
    },
    page: {
      counter: {
        value: 0
      },
      hn: {
        loaded: false,
        stories: []
      }
    }
  };
}
