import {
  ELoaiHocPhanDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { getHocPhanDangKyTinChi } from '@/services/DaoTao/DiemHocPhan';
import { Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FilterHocPhanDKTC = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const { dotDangKyHienTai, hocPhanDangKy, setHocPhanDangKy } = useModel('daotao.dotdangkytinchi');
  const [thongTinHocPhan, setThongTinHocPhan] = useState<DangKyTinChi.ThongTinHocPhan>();
  const [loaiHocPhan, setLoaiHocPhan] = useState<ELoaiHocPhanDangKyTinChi>(
    ELoaiHocPhanDangKyTinChi.TAT_CA,
  );
  const danhSach = thongTinHocPhan?.[loaiHocPhan];

  useEffect(() => {
    return () => {
      setHocPhanDangKy(undefined);
    };
  }, []);

  useEffect(() => {
    if (recHocKy?.ma && dotDangKyHienTai?._id) {
      getHocPhanDangKyTinChi(recHocKy.ma).then((res) => setThongTinHocPhan(res.data?.data));
    }
  }, [recHocKy?.ma, dotDangKyHienTai?._id]);

  return (
    <Space size={8} wrap>
      <Select
        options={Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
          key: item,
          value: item,
          label: LoaiHocPhanDangKyTinChi?.[item],
        }))}
        value={loaiHocPhan}
        onChange={(val) => {
          setLoaiHocPhan(val);
          setHocPhanDangKy(thongTinHocPhan?.[val]?.[0]);
        }}
        style={{ width: 200 }}
      />

      <Select
        options={danhSach?.map((item) => ({
          key: item.maMonHoc,
          value: item.maMonHoc,
          label: [item.tenMonHoc, item.maMonHoc].join(' - '),
        }))}
        value={hocPhanDangKy?.maMonHoc}
        onChange={(val) => setHocPhanDangKy(danhSach?.find((item) => item.maMonHoc === val))}
        showSearch
        placeholder="Chọn học phần"
        optionFilterProp="label"
        style={{ width: 300 }}
      />
    </Space>
  );
};

export default FilterHocPhanDKTC;
