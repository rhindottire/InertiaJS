import { useEffect, useState } from 'react';

export function useRequiredFieldNumber<TData extends Record<string, unknown>>(data: TData) {
  const [requiredFieldsNumber, setRequiredFieldsNumber] = useState<number>(0);

  const setRequiredFieldsNumberHandler = () => {
    let count = 0;

    Object.values(data).forEach((value) => {
      if (value) count += 1;
    });
    setRequiredFieldsNumber(count);
  };

  useEffect(() => {
    setRequiredFieldsNumberHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return [requiredFieldsNumber, setRequiredFieldsNumber] as const;
}
