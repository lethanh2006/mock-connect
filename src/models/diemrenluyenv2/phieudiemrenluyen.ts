import useInitModel from "@/hooks/useInitModel";

export default () => {
  const objInit = useInitModel<PhieuDiemRenLuyenV2.IRecord>('drl/phieu-drl');

  return {
    ...objInit,
  };
}
