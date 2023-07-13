import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
  type ELoaiHocPhanDangKyTinChi,
  ETrangThaiDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
  ColorTrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ModalDangKy = (props: { tongTinChi: number }) => {
  const { tongTinChi } = props;
  const {
    visibleRegister,
    setVisibleRegister,
    danhSachLopDangKy,
    postDangKyTinChiModel,
    getPhieuDangKyModel,
    phieuDangKy,
    loading,
  } = useModel('daotao.dotdangkytinchi');
  const { record: recHocKy } = useModel('daotao.hocky');
  const [danhSachMoi, setDanhSachMoi] = useState<DangKyTinChi.ILopDangKy[]>([]); // Danh sách lớp mới thêm
  const [formSubmiting, setFormSubmiting] = useState<boolean>();

  const postDangKy = async () => {
    setFormSubmiting(true);

    // Với từng lớp mới chọn thì gọi 1 API đăng ký
    const promises = danhSachMoi.map((item, index) =>
      postDangKyTinChiModel({
        phieuDktcId: phieuDangKy?._id ?? '',
        dangKy: { lopHocPhanId: item._id },
      })
        .then(() =>
          // Nếu thành công
          setDanhSachMoi((p) => {
            const p1 = [...p];
            p1[index].trangThai = ETrangThaiDangKyTinChi.DA_DANG_KY;
            return p1;
          }),
        )
        .catch(() =>
          setDanhSachMoi((p) => {
            const p1 = [...p];
            p1[index].trangThai = ETrangThaiDangKyTinChi.LOI;
            p1[index].error = 'error code here';
            return p1;
          }),
        ),
    );
    Promise.all(promises)
      .then()
      .finally(() => {
        message.success('Đã đăng ký xong');
        getPhieuDangKyModel(recHocKy?.ma ?? ''); // Get lại thông tin phiếu đăng ký của kỳ hiện tại
        setFormSubmiting(false);
      });
  };

  useEffect(() => {
    // Lấy lại danh sách các lớp học phần mới chọn
    if (visibleRegister)
      setDanhSachMoi(
        danhSachLopDangKy.filter((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY),
      );
  }, [visibleRegister]);

  const onRegister = () => {
    Modal.confirm({
      title: 'Xác nhận đăng ký',
      content: (
        <>
          Xác nhận đăng ký các lớp học phần đã chọn?
          {tongTinChi < (phieuDangKy?.soTinChiToiThieu ?? 0) ? (
            <div style={{ color: 'orange' }}>
              Lưu ý: Tổng số tín chỉ đăng ký hiện tại đang thấp hơn quy định số tín chỉ tối thiểu
              đăng ký trong học kỳ!
            </div>
          ) : null}
        </>
      ),
      onOk: postDangKy,
    });
  };

  const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
    {
      title: 'Mã học phần',
      dataIndex: 'maHocPhan',
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
      title: 'Lớp học phần',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
    },
    {
      title: 'Loại ĐK',
      dataIndex: 'loai',
      width: 120,
      render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 170,
      align: 'center',
      render: (val: ETrangThaiDangKyTinChi, rec) =>
        formSubmiting && val === ETrangThaiDangKyTinChi.CHUA_DANG_KY ? (
          <SyncOutlined spin className="text-info" />
        ) : (
          <>
            <Tag color={ColorTrangThaiDangKyTinChi[val]}>{val}</Tag>
            {rec.error ? (
              <div>
                <i>{rec.error}</i>
              </div>
            ) : null}
          </>
        ),
    },
  ];

  return (
    <Modal
      visible={visibleRegister}
      closable={false}
      footer={null}
      width={1000}
      bodyStyle={{ padding: 0 }}
      maskClosable={false}
    >
      <Card title="Danh sách đăng ký mới">
        <TableStaticData columns={columns} data={danhSachMoi} addStt loading={loading} />

        <div className="form-footer">
          <Button onClick={onRegister} type="primary" loading={formSubmiting}>
            Xác nhận
          </Button>
          <Button onClick={() => setVisibleRegister(false)} disabled={formSubmiting}>
            Đóng
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default ModalDangKy;
