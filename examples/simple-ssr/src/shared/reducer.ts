export type RootState = {
  url: string;
  timestamp: number;
  page: {
    counter: {
      value: number;
    };
  };
};

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

export type Action =
  | InitAction
  | IncrementAction
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

export function reducer(state: RootState, action: Action): RootState {
  switch (action.type) {
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
    page: {
      counter: {
        value: 0
      },
    }
  };
}
