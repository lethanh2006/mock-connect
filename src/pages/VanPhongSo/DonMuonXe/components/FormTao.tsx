import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { useModel } from 'umi';

const FormTao = () => {
  const { danhSach } = useModel('dichvumotcuav2');
  const { initialState } = useModel('@@initialState');
  const record = danhSach?.find((item) => item?.maDichVu == 'MUON_OTO');
  return (
    <>
      <FormBieuMau
        type="muonCsvc"
        infoNguoiTaoDon={initialState?.currentUser}
        record={
          {
            thongTinDichVu: { ...record },
          } as DichVuMotCuaV2.Don
        }
      />
    </>
  );
};

export default FormTao;
