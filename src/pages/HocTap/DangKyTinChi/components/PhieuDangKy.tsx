import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
  ColorTrangThaiDangKyTinChi,
  ELoaiDangKyTinChi,
  ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { CalendarOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { Modal, Button, Col, Divider, Popconfirm, Row, Tag, Tooltip, Space } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useModel } from 'umi';

const PhieuDangKy = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const {
    dotDangKyHienTai,
    phieuDangKy,
    danhSachLopDangKy,
    setDanhSachLopDangKy,
    loading,
    deleteDangKyTinChiModel,
    postDangKyTinChiModel,
    getPhieuDangKyModel,
  } = useModel('daotao.dotdangkytinchi');
  const tongTinChi = _.sumBy(danhSachLopDangKy, (item) => item.soTinChi);
  const tongTinChiChuaDk = _.sumBy(
    danhSachLopDangKy.filter((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY),
    (item) => item.soTinChi,
  );

  const onDeleteLop = async (rec: DangKyTinChi.ILopDangKy) => {
    if (rec.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY)
      await deleteDangKyTinChiModel({
        phieuDktcId: phieuDangKy?._id ?? '',
        lopHocPhanId: rec._id ?? '',
      });

    const data = danhSachLopDangKy.filter((item) => item._id !== rec._id);
    setDanhSachLopDangKy(data);
  };

  const onRegister = (): void => {
    Modal.confirm({
      title: 'Xác nhận đăng ký',
      content: 'Xác nhận đăng ký các lớp học phần đã chọn?',
      onOk: () => {
        const danhSachDangKy = danhSachLopDangKy
          .filter((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY)
          .map((item) => ({ lopHocPhanId: item._id ?? '' }));
        postDangKyTinChiModel({ phieuDktcId: phieuDangKy?._id ?? '', danhSachDangKy })
          .then(() => getPhieuDangKyModel(recHocKy?.ma ?? ''))
          .catch((er) => console.log(er));
      },
    });
  };

  const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
    {
      title: 'Mã học phần',
      dataIndex: 'maHocPhan',
      width: 100,
    },
    {
      title: 'Tên học phần',
      width: 170,
      render: (val, rec) => rec.hocPhan?.ten,
    },
    {
      title: 'Số TC',
      dataIndex: 'soTinChi',
      width: 60,
      align: 'center',
    },
    {
      title: 'Lớp học phần',
      width: 150,
    },
    {
      title: 'Lịch học',
      width: 150,
    },
    {
      title: 'Giảng viên',
      width: 120,
    },
    {
      title: 'Học phí',
      width: 120,
    },
    {
      title: 'Loại ĐK',
      dataIndex: 'loaiDangKy',
      width: 120,
      filterType: 'select',
      filterData: Object.values(ELoaiDangKyTinChi),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 120,
      align: 'center',
      filterType: 'select',
      filterData: Object.values(ETrangThaiDangKyTinChi),
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
    },
  ];

  return (
    <>
      <Divider>Danh sách lớp học phần đã đăng ký/ đã chọn</Divider>
      <Row gutter={[8, 12]} style={{ marginBottom: 18 }}>
        <Col span={24} md={8}>
          Tổng số tín chỉ:{' '}
          <b style={{ color: tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0) ? 'red' : undefined }}>
            {tongTinChi} tín
          </b>
        </Col>
        <Col span={24} md={16}>
          Học phí dự kiến: <b>- đ</b>
        </Col>
        <Col span={24} md={12}>
          Trạng thái phê duyệt: <Tag color="red">Chưa phê duyệt</Tag>
        </Col>
        <Col span={24} md={12}>
          <div className="fw500" style={{ color: 'red', textAlign: 'right' }}>
            Bạn được đăng ký trong khoảng tín chỉ:{' '}
            {[phieuDangKy?.soTinChiToiThieu, phieuDangKy?.soTinChiToiDa].join(' - ')}
          </div>
        </Col>
      </Row>

      <TableStaticData columns={columns} data={danhSachLopDangKy} addStt loading={loading} hasTotal>
        <Space wrap>
          {danhSachLopDangKy.length ? (
            <Button icon={<CalendarOutlined />}>Xem trước lịch học</Button>
          ) : null}

          {dotDangKyHienTai &&
          moment().isSameOrAfter(dotDangKyHienTai.thoiGianBatDau) &&
          moment().isSameOrBefore(dotDangKyHienTai.thoiGianKetThuc) &&
          tongTinChiChuaDk ? (
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
                onClick={onRegister}
                disabled={tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0)}
              >
                Đăng ký
              </Button>
            </Tooltip>
          ) : null}
        </Space>
      </TableStaticData>
    </>
  );
};

export default PhieuDangKy;
