import useInitModel from '@/hooks/useInitModel';


export default () => {
  const objInit = useInitModel<DotChamDiemRenLuyen.IRecord>('dot-cham-diem-ren-luyen');




  return {
    ...objInit,
  };
};
