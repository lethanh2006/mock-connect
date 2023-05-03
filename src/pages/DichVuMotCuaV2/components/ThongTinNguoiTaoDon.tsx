import { Descriptions } from 'antd';
import { useModel } from 'umi';

const ThongTinNguoiTaoDon = (props: {
  record?: SinhVien.IRecord;
  thongTinNguoiTaoAdmin?: { hoTen: string; maDonVi: string; maSinhVien: string };
}) => {
  const { loaiDichVu, recordDon } = useModel('dichvumotcuav2');

  return (
    <Descriptions>
      <Descriptions.Item>Họ và tên: {props?.record?.ten}</Descriptions.Item>
      {loaiDichVu === 'DVMC' && (
        <Descriptions.Item>Ngày sinh: {props?.record?.ngaySinh ?? ''}</Descriptions.Item>
      )}
      <Descriptions.Item>
        {'Mã sinh viên'}: {props?.record?.ma || props?.thongTinNguoiTaoAdmin?.maSinhVien || ''}
      </Descriptions.Item>
      {loaiDichVu === 'DVMC' && (
        <>
          <Descriptions.Item>
            Lớp: {props?.record?.lopHanhChinhList?.[0]?.ten ?? ''}
          </Descriptions.Item>
          <Descriptions.Item span={2}>
            Ngành/Chuyên ngành:{' '}
            {props?.record?.nganh?.ten || props.record?.nganh?.tenTiengAnh || ''}
          </Descriptions.Item>
          <Descriptions.Item>Khóa: {props?.record?.khoaSinhVien?.ten}</Descriptions.Item>
          {/* <Descriptions.Item>
            Hình thức đào tạo: {recordDon?.thongTinNguoiTao?.hinhThucDaoTaoId?.[1] ?? ''}
          </Descriptions.Item> */}
          <Descriptions.Item>SĐT: {props?.record?.soDienThoai}</Descriptions.Item>
          <Descriptions.Item>Email: {props?.record?.email}</Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
};

export default ThongTinNguoiTaoDon;
