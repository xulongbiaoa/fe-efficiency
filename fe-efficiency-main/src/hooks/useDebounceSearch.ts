import { debounce } from 'lodash';

import { useCallback, useEffect, useState } from 'react';

const useDebouncesSearch = (handleInputValue: (inputValue: string) => void) => {
  const [inputValue, setInputValue] = useState<string>('');

  const debounceHandleInputValue = useCallback(debounce(handleInputValue, 500), []);

  useEffect(() => {
    debounceHandleInputValue(inputValue);
  }, [inputValue]);
  return { setInputValue };
};

export default useDebouncesSearch;
