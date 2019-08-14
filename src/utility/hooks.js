import { useState, useEffect } from "react";
import { globalHistory } from "@reach/router";

// Sourced from reach/router/issues/203
// Repository is licensed under MIT
// https://github.com/reach/router/issues/203

export function useLocation() {
  const initialState = {
    location: globalHistory.location,
    navigate: globalHistory.navigate
  };

  const [state, setState] = useState(initialState);
  useEffectOnce(() => {
    const removeListener = globalHistory.listen(params => {
      const { location } = params;
      const newState = Object.assign({}, initialState, { location });
      setState(newState);
    });
    return () => {
      removeListener();
    };
  });

  return state;
}

export function useEffectOnce(effectFunc) {
  useEffect(effectFunc, []);
}
