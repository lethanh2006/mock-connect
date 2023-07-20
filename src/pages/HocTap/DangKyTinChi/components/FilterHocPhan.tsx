import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
  ELoaiHocPhanDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { getHocPhanDangKyTinChi } from '@/services/DaoTao/HocPhan';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ViewGhiChuDangKyTinChi from './ViewGhiChuDangKyTinChi';

const FilterHocPhanDKTC = (props: { child: () => JSX.Element }) => {
  const { dotDangKyHienTai, hocPhanDangKy, setHocPhanDangKy, loaiHocPhan, setLoaiHocPhan } =
    useModel('daotao.dotdangkytinchi');
  const { record: recHocKy } = useModel('daotao.hocky');
  const [danhSachHocPhan, setDanhSachHocPhan] = useState<DangKyTinChi.IHocPhanDangKy[]>([]);
  const { child } = props;
  const loaiHocPhanDangKy = Object.values(ELoaiHocPhanDangKyTinChi);
  if (!recHocKy?.isToChucDangKyNhuCau) loaiHocPhanDangKy.splice(0, 1); // Nếu học kỳ không đăng ký nhu cầu thì bỏ loại Nhu cầu đi

  /**
   * Lấy danh sách học phần tương ứng với loại học phần truyền vào
   * @param loai
   * @returns
   */
  const getDanhSach = (loai: ELoaiHocPhanDangKyTinChi) =>
    loai === ELoaiHocPhanDangKyTinChi.NHU_CAU
      ? danhSachHocPhan?.filter((item) => item.nhuCau)
      : danhSachHocPhan?.filter((item) => item.loai === loai);

  useEffect(() => {
    setLoaiHocPhan(loaiHocPhanDangKy[0]);
  }, [recHocKy?.ma]);

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

  const onCell = (rec: DangKyTinChi.IHocPhanDangKy) => ({
    onClick: () => setHocPhanDangKy(rec),
    style: {
      cursor: 'pointer',
      fontWeight: rec._id === hocPhanDangKy?._id ? 600 : undefined,
      backgroundColor: rec._id === hocPhanDangKy?._id ? '#f0f0f0' : undefined,
    },
  });

  const columns: IColumn<DangKyTinChi.IHocPhanDangKy & { index: number }>[] = [
    { title: 'TT', dataIndex: 'index', width: 60, align: 'center', onCell },
    {
      title: 'Mã học phần',
      dataIndex: 'maHocPhan',
      width: 100,
      align: 'center',
      filterType: 'string',
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: ['hocPhan', 'ten'],
      width: 150,
      filterType: 'string',
      onCell,
    },
  ];

  return (
    <>
      <Space size={8} wrap>
        <Select
          options={loaiHocPhanDangKy.map((item) => ({
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

        {/* <Select
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
        /> */}
        <Popover content={<ViewGhiChuDangKyTinChi />}>
          <Button type="link" icon={<QuestionCircleOutlined />}>
            Hướng dẫn Đăng ký
          </Button>
        </Popover>
      </Space>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={24} md={8}>
          <TableStaticData
            data={getDanhSach(loaiHocPhan).map((item, index) => ({ ...item, index: index + 1 }))}
            columns={columns}
          />
        </Col>

        <Col span={24} md={16}>
          {child()}
        </Col>
      </Row>
    </>
  );
};

export default FilterHocPhanDKTC;
