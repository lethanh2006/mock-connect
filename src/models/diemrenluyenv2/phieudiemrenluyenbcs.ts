import useInitModel from "@/hooks/useInitModel";

export default () => {
  const objInit = useInitModel<PhieuDiemRenLuyenV2.IRecord>('phieu-diem-ren-luyen/ban-can-su');

  return {
    ...objInit,
  };
}
