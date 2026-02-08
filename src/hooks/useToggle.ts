import { useState, useCallback } from 'react';

export const useToggle = (initialState: boolean = false): [boolean, () => void, (value: boolean) => void] => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  const setValue = useCallback((value: boolean) => {
    setState(value);
  }, []);

  return [state, toggle, setValue];
};
