import {
  ELoaiHocPhanDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { getHocPhanDangKyTinChi } from '@/services/DaoTao/HocPhan';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ViewGhiChuDangKyTinChi from './ViewGhiChuDangKyTinChi';

const FilterHocPhanDKTC = () => {
  const { dotDangKyHienTai, hocPhanDangKy, setHocPhanDangKy, loaiHocPhan, setLoaiHocPhan } =
    useModel('daotao.dotdangkytinchi');
  const [danhSachHocPhan, setDanhSachHocPhan] = useState<DangKyTinChi.IHocPhanDangKy[]>([]);

  /**
   * Lấy danh sách học phần tương ứng với loại học phần truyền vào
   * @param loai
   * @returns
   */
  const getDanhSach = (loai: ELoaiHocPhanDangKyTinChi) =>
    loai === ELoaiHocPhanDangKyTinChi.TAT_CA
      ? danhSachHocPhan
      : loai === ELoaiHocPhanDangKyTinChi.NHU_CAU
      ? danhSachHocPhan?.filter((item) => item.nhuCau)
      : danhSachHocPhan?.filter((item) => item.loai === loai);

  useEffect(() => {
    return () => {
      setHocPhanDangKy(undefined);
      setLoaiHocPhan(ELoaiHocPhanDangKyTinChi.NHU_CAU);
    };
  }, []);

  useEffect(() => {
    if (dotDangKyHienTai?._id) {
      getHocPhanDangKyTinChi().then((res) => setDanhSachHocPhan(res.data?.data ?? []));
    }
  }, [dotDangKyHienTai?._id]);

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
          setHocPhanDangKy(getDanhSach(val)?.[0]);
        }}
        style={{ width: 200 }}
      />

      <Select
        options={getDanhSach(loaiHocPhan)?.map((item) => ({
          key: item._id,
          value: item.maHocPhan,
          label: [item.hocPhan?.ten, item.maHocPhan].join(' - '),
        }))}
        value={hocPhanDangKy?.maHocPhan}
        onChange={(val) =>
          val && setHocPhanDangKy(danhSachHocPhan?.find((item) => item.maHocPhan === val))
        }
        showSearch
        placeholder="Chọn học phần"
        optionFilterProp="label"
        style={{ width: 300 }}
      />
      <Popover content={<ViewGhiChuDangKyTinChi />}>
        <Button type="link" icon={<QuestionCircleOutlined />}>
          Hướng dẫn Đăng ký
        </Button>
      </Popover>
    </Space>
  );
};

export default FilterHocPhanDKTC;
