import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<SuKien.IRecord>('su-kien');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectValue, setSelectValue] = useState<string[]>([]);

  return {
    ...objInit,
    year,
    setYear,
    selectValue,
    setSelectValue,
  };
};
