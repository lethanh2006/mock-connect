import { Descriptions } from 'antd';
import { useModel } from 'umi';
import DanhSachGiangVien from '../../LopHocPhan/components/DanhSachGiangVien';
import DanhSachSinhVien from '../../LopHocPhan/components/DanhSachSinhVien';

const ThongTinChungLopHanhChinh = () => {
  const { record, loading } = useModel('daotao.lophanhchinh');

  return (
    <>
      <Descriptions column={{ xs: 1, md: 2 }} title="Thông tin lớp">
        <Descriptions.Item label="Tên lớp">{record?.ten ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Sĩ số">
          {record?.siSo ?? record?.sinhVienList?.length ?? 0} sinh viên
        </Descriptions.Item>
        <Descriptions.Item label="Khóa sinh viên">
          {record?.khoaSinhVien?.ten ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngành đào tạo">{record?.nganh?.ten ?? '--'}</Descriptions.Item>
      </Descriptions>

      <DanhSachGiangVien
        title="Cố vấn học tập"
        danhSachNhanSu={record?.giangVien?.ssoId ? [record.giangVien] : []}
      />

      <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Danh sách sinh viên</h4>
      <DanhSachSinhVien sinhVienList={record?.sinhVienList ?? []} loading={loading} />
    </>
  );
};

export default ThongTinChungLopHanhChinh;
