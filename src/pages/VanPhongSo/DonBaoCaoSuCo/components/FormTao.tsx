import FormBieuMau from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { MaDichVuVps } from '@/utils/constants';
import { useModel } from 'umi';

const FormTao = () => {
  const { danhSach } = useModel('dichvumotcuav2');
  const { initialState } = useModel('@@initialState');
  const record = danhSach?.find((item) => item?.maDichVu == MaDichVuVps.BAO_CAO_SU_CO);
  return (
    <>
      <FormBieuMau
        type="muonCsvc"
        // isMuonPhongHop={true}
        isBaoCaoSuCo
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
