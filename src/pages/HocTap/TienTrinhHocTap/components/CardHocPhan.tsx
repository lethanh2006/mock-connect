import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { useState } from 'react';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import { useModel } from 'umi';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';

const CardHocPhan = (props: {
  chuongTrinhKhung?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
  sinhVienLopHocPhan?: LopHocPhan.IRecordSinhVienLopHP;
  isChuyenNganh?: boolean;
}) => {
  const { setSinhVienLopHocPhan } = useModel('daotao.sinhvienlophocphan');
  const [modalVisible, setModalVisible] = useState(false);
  const { chuongTrinhKhung, sinhVienLopHocPhan } = props;
  const listDiem = chuongTrinhKhung?.lichSuDiem?.map(
    (diem) => diem.diemChu || ELoaiDiemChu.CHUA_DU_DU_LIEU,
  ) ?? [sinhVienLopHocPhan?.diemChu || ELoaiDiemChu.CHUA_DU_DU_LIEU];
  // if (
  //   listDiem?.slice(-1)[0] !== ELoaiDiemChu.CHUA_DU_DU_LIEU &&
  //   chuongTrinhKhung?.hoc === ETrangThaiHocTap.DANG_HOC
  // )
  //   listDiem?.push(ELoaiDiemChu.CHUA_DU_DU_LIEU);
  const hocPhan = chuongTrinhKhung?.hocPhan ?? sinhVienLopHocPhan?.hocPhan;
  const soTinChi = chuongTrinhKhung?.soTinChi ?? sinhVienLopHocPhan?.soTinChi;

  return (
    <div className="col-hoc-phan">
      <div
        className={`card-hoc-phan ${
          chuongTrinhKhung?.hoc === ETrangThaiHocTap.CHUA_HOC && 'card-chua-hoc'
        }`}
        onClick={() => {
          setSinhVienLopHocPhan(chuongTrinhKhung?.lichSuDiem?.[0] ?? sinhVienLopHocPhan);
          setModalVisible(true);
        }}
      >
        <h4
          className={
            chuongTrinhKhung?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ? 'tu_chon' : undefined
          }
        >
          {hocPhan?.ten}
        </h4>
        <span className="tin-chi">{soTinChi} tín</span>
        <img src="/images/img-card-hoc-phan.svg" />
      </div>
      {listDiem?.map((diem, index) => (
        <div
          className={`bookmark bookmark-diem ${
            diem.includes('A') || diem.includes('B')
              ? 'diem-green'
              : diem.includes('C') || diem.includes('D')
              ? 'diem-yellow'
              : diem?.includes('F')
              ? 'diem-red'
              : 'diem-gray'
          }`}
          style={{ right: 1 + index * 2.3 + 'rem' }}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        >
          {diem}
        </div>
      ))}

      {chuongTrinhKhung?.hoc === ETrangThaiHocTap.DANG_HOC ? (
        <div className="bookmark bookmark-dang-hoc" title="Đang học" />
      ) : null}

      <ModalChiTietDiem
        setVisible={setModalVisible}
        visible={modalVisible}
        chuongTrinhKhung={{ hocPhan, soTinChi }}
      />
    </div>
  );
};

export default CardHocPhan;
