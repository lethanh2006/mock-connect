import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
  ELoaiHocPhanDangKyTinChi,
  ETrangThaiHocPhanDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ViewGhiChuDangKyTinChi from './ViewGhiChuDangKyTinChi';

const FilterHocPhanDKTC = (props: { child: () => JSX.Element }) => {
  const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');
  const {
    record: hocPhanDangKy,
    setRecord: setHocPhanDangKy,
    setDanhSach,
    loaiHocPhan,
    setLoaiHocPhan,
    page,
    limit,
    getModel,
  } = useModel('daotao.hocphandangkytinchi');
  const { record: recHocKy } = useModel('daotao.hocky');
  const { child } = props;
  const loaiHocPhanDangKy = Object.values(ELoaiHocPhanDangKyTinChi);
  if (!recHocKy?.isToChucDangKyNhuCau) loaiHocPhanDangKy.splice(0, 1); // Nếu học kỳ không đăng ký nhu cầu thì bỏ loại Nhu cầu đi

  const getData = () =>
    recHocKy?.ma &&
    dotDangKyHienTai?._id &&
    loaiHocPhan &&
    getModel(
      { loai: loaiHocPhan },
      undefined,
      undefined,
      undefined,
      undefined,
      `${recHocKy.ma}/page`,
      { trongChuongTrinh: loaiHocPhan === ELoaiHocPhanDangKyTinChi.HOC_NGOAI ? 0 : 1 },
    ).then((data) => setHocPhanDangKy(data?.[0]));

  useEffect(() => {
    setLoaiHocPhan(loaiHocPhanDangKy[0]);
  }, [recHocKy?.ma]);

  useEffect(() => {
    return () => {
      setDanhSach([]);
      setHocPhanDangKy(undefined);
      setLoaiHocPhan(undefined);
    };
  }, []);

  const onCell = (rec: DangKyTinChi.IHocPhanDangKy) => ({
    onClick: () => setHocPhanDangKy(rec),
    style: {
      cursor: 'pointer',
      fontWeight: rec.maHocPhan === hocPhanDangKy?.maHocPhan ? 600 : undefined,
      backgroundColor: rec.maHocPhan === hocPhanDangKy?.maHocPhan ? '#f0f0f0' : undefined,
      color: rec.trangThai !== ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? '#cc0101' : undefined,
    },
  });

  const columns: IColumn<DangKyTinChi.IHocPhanDangKy & { index: number }>[] = [
    { title: 'TT', dataIndex: 'index', width: 60, align: 'center', onCell },
    {
      title: 'Mã HP',
      dataIndex: 'maHocPhan',
      width: 80,
      align: 'center',
      filterType: 'string',
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: 'tenHocPhan',
      width: 170,
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
          onChange={(val) => setLoaiHocPhan(val)}
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
          <TableBase
            columns={columns}
            dependencies={[page, limit, loaiHocPhan, recHocKy?.ma]}
            getData={getData}
            modelName="daotao.hocphandangkytinchi"
            hideCard
            buttons={{ create: false, reload: false, filter: false }}
            hideTotal
            addStt={false}
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
