import React, { useCallback, useEffect } from "react";
import { useRootState, useDispatch } from "../App";
import * as actions from "../reducer";

export function Counter() {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const onClickIncrement = useCallback(() => dispatch(actions.increment()), []);
  const onClickDecrement = useCallback(() => dispatch(actions.decrement()), []);
  return (
    <div>
      <h2>Counter</h2>
      <button onClick={onClickIncrement}>+1</button>
      <button onClick={onClickDecrement}>-1</button>
      <div>value: {rootState.page.counter.value}</div>
    </div>
  );
}
