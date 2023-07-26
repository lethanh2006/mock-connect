import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
  ColorTrangThaiDangKyTinChi,
  ELoaiHocPhanDangKyTinChi,
  ETrangThaiDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { CalendarOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Space, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useModel } from 'umi';
import ModalDangKy from './ModalDangKy';
import ModalLichHoc from './ModalLichHoc';
import { useEffect } from 'react';

const PhieuDangKy = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const {
    dotDangKyHienTai,
    phieuDangKy,
    danhSachLopDangKy,
    setDanhSachLopDangKy,
    loading,
    deleteDangKyTinChiModel,
    tinhDataLichHoc,
    setVisibleModal,
    setVisibleRegister,
    getPhieuDangKyModel,
    getLopDangKyModel,
  } = useModel('daotao.dotdangkytinchi');
  // Danh sách học phần đã đăng ký có cả lớp Chính và lớp thực hành
  const hocPhanCoLopThucHanh = danhSachLopDangKy
    .filter((item) => !!item.tenCha && item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY)
    .map((item) => item.maHocPhan);
  // Nếu có cả lớp chính và lớp thực hành thì chỉ hiện lớp thực hành
  const danhSachLopHienThi = danhSachLopDangKy
    .filter((item) => !hocPhanCoLopThucHanh.includes(item.maHocPhan) || !!item.tenCha)
    .map((item) =>
      hocPhanCoLopThucHanh.includes(item.maHocPhan)
        ? {
            ...item,
            // Gộp lịch học lớp Chính với lớp hiển thị
            maHoaLichHoc: danhSachLopDangKy
              .filter((j) => j.maHocPhan === item.maHocPhan)
              .map((j) => j.maHoaLichHoc)
              .flat(),
          }
        : item,
    );
  const tongTinChi = _.sumBy(danhSachLopHienThi, (item) => item.soTinChi);
  const tongTinChiChuaDk = _.sumBy(
    danhSachLopDangKy.filter((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY),
    (item) => item.soTinChi,
  );
  // Đang trong thời gian đăng ký học phần => Được phép đăng ký, xóa đăng ký
  const dangTrongThoiGian =
    dotDangKyHienTai?.thoiGianBatDau &&
    dotDangKyHienTai?.thoiGianKetThuc &&
    moment().isSameOrAfter(dotDangKyHienTai?.thoiGianBatDau) &&
    moment().isSameOrBefore(dotDangKyHienTai?.thoiGianKetThuc);

  useEffect(() => {
    if (dotDangKyHienTai?._id) getPhieuDangKyModel(dotDangKyHienTai._id);
  }, [dotDangKyHienTai?._id]);

  useEffect(() => {
    if (recHocKy?.ma) getLopDangKyModel(recHocKy.ma);
  }, [recHocKy?.ma]);

  const onDeleteLop = async (rec: DangKyTinChi.ILopDangKy) => {
    try {
      // Nếu đã đăng ký rồi thì gọi API để xóa lớp
      if (rec.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY)
        await deleteDangKyTinChiModel({
          phieuDktcId: phieuDangKy?._id ?? '',
          lopHocPhanId: rec._id ?? '',
        });

      // Xóa lớp ở danh sách tại local
      const data = danhSachLopDangKy.filter((item) => item.maHocPhan !== rec.maHocPhan);
      tinhDataLichHoc(data); // Tính lại dữ liệu lịch học
      setDanhSachLopDangKy(data);
    } catch (er) {
      console.log(er);
    }
  };

  const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
    {
      title: 'Mã học phần',
      dataIndex: 'maHocPhan',
      align: 'center',
      width: 100,
      filterType: 'string',
    },
    {
      title: 'Tên học phần',
      dataIndex: ['hocPhan', 'ten'],
      width: 170,
      filterType: 'string',
    },
    {
      title: 'TT lớp',
      dataIndex: 'soThuTuLop',
      align: 'center',
      width: 60,
    },
    {
      title: 'TT nhóm',
      dataIndex: 'soThuTuNhom',
      align: 'center',
      width: 60,
    },
    {
      title: 'Số TC',
      dataIndex: 'soTinChi',
      width: 60,
      align: 'center',
      sortable: true,
    },
    {
      title: 'Lịch học & giảng viên',
      width: 350,
      render: (val, rec) =>
        rec.maHoaLichHoc?.length ? (
          <ul className="lich-hoc">
            {rec.maHoaLichHoc
              ?.sort((a, b) => a.thu - b.thu)
              ?.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                  {item.thu < 7 ? `T${item.thu + 1}` : 'CN'} ({item.tietBatDau}-
                  {item.tietBatDau + item.soTiet - 1}), tuần{' '}
                  {item.danhSachTuan
                    .map((j) => j.tuan)
                    .sort((a, b) => a - b)
                    .join(',')}
                  , {item.nhanSu ?? <i style={{ color: '#999' }}>Không có thông tin giảng viên</i>}
                </li>
              ))}
          </ul>
        ) : (
          <i style={{ color: '#999' }}>Không có thông tin lịch học</i>
        ),
    },
    {
      title: 'Học phí',
      width: 120,
      hide: !dangTrongThoiGian,
    },
    {
      title: 'Loại ĐK',
      dataIndex: 'loai',
      width: 120,
      filterType: 'select',
      filterData: Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
        label: LoaiHocPhanDangKyTinChi[item],
        value: item,
      })),
      render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 120,
      align: 'center',
      render: (val: ETrangThaiDangKyTinChi) => (
        <Tag color={ColorTrangThaiDangKyTinChi[val]}>{val}</Tag>
      ),
    },
    {
      title: 'Hủy',
      width: 60,
      fixed: 'right',
      align: 'center',
      render: (val, rec) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn huỷ đăng ký lớp học phần này?"
          placement="topLeft"
          onConfirm={() => onDeleteLop(rec)}
        >
          <Button icon={<DeleteOutlined />} danger type="link" />
        </Popconfirm>
      ),
      hide: !dangTrongThoiGian,
    },
  ];

  return (
    <>
      <Divider style={{ marginTop: 24 }}>Danh sách lớp học phần đã đăng ký / đã chọn</Divider>
      <Row gutter={[8, 12]} style={{ marginBottom: 18 }}>
        <Col span={24} md={8}>
          Tổng số tín chỉ:{' '}
          <b style={{ color: tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0) ? 'red' : undefined }}>
            {tongTinChi} tín
          </b>
        </Col>
        {dangTrongThoiGian ? (
          <>
            <Col span={24} md={8}>
              Học phí dự kiến: <b>- đ</b>
            </Col>
            <Col span={24} md={8}>
              <div className="fw500" style={{ color: 'red', textAlign: 'right' }}>
                Bạn được đăng ký trong khoảng tín chỉ:{' '}
                {[phieuDangKy?.soTinChiToiThieu, phieuDangKy?.soTinChiToiDa].join(' - ')}
              </div>
            </Col>
          </>
        ) : null}
      </Row>

      <TableStaticData
        columns={columns}
        data={danhSachLopHienThi}
        addStt
        loading={loading}
        hasTotal
      >
        <Space wrap>
          {danhSachLopDangKy.length ? (
            <Button icon={<CalendarOutlined />} onClick={() => setVisibleModal(true)}>
              Xem trước lịch học
            </Button>
          ) : null}

          {dangTrongThoiGian && tongTinChiChuaDk ? (
            <Tooltip
              title={
                tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0)
                  ? 'Bạn đã đăng ký quá số tín chỉ tối đa'
                  : undefined
              }
            >
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => setVisibleRegister(true)}
                disabled={tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0)}
              >
                Đăng ký
              </Button>
            </Tooltip>
          ) : null}
        </Space>
      </TableStaticData>

      <ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />

      <ModalDangKy tongTinChi={tongTinChi} />
    </>
  );
};

export default PhieuDangKy;
