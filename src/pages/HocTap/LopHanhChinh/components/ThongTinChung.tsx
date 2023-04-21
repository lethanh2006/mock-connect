import teacherIcon from '@/assets/teacher.png';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { Descriptions, List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { useAccess } from 'umi';
import DanhSachSinhVien from './DanhSachSinhVien';

const ThongTinChungLopHanhChinh = (props: {
  danhSachSinhVien: APILopHanhChinh.ISinhVienDiemHanhChinh[];
  giangVien?: Login.Profile;
  diemTichLuyLonNhat?: number;
  diemTichLuyNhoNhat?: number;
  diemTichLuyTB?: number;
}) => {
  const { danhSachSinhVien, giangVien, diemTichLuyLonNhat, diemTichLuyNhoNhat, diemTichLuyTB } =
    props;
  const access = useAccess();

  return (
    <>
      <Descriptions column={{ xs: 1, md: 2 }} title="Thông tin lớp">
        <Descriptions.Item label="Sĩ số">
          <b>{danhSachSinhVien?.length ?? 0} sinh viên</b>
        </Descriptions.Item>
        {access.nhanVien ? (
          <>
            {diemTichLuyLonNhat !== undefined && (
              <Descriptions.Item label="Điểm tích lũy cao nhất">
                <b>{diemTichLuyLonNhat}</b>
              </Descriptions.Item>
            )}
            {diemTichLuyNhoNhat !== undefined && (
              <Descriptions.Item label="Điểm tích lũy thấp nhất">
                <b>{diemTichLuyNhoNhat}</b>
              </Descriptions.Item>
            )}
            {diemTichLuyTB !== undefined && (
              <Descriptions.Item label="Điểm tích lũy trung bình">
                <b>{Math.round(diemTichLuyTB * 100) / 100}</b>
              </Descriptions.Item>
            )}
          </>
        ) : null}
      </Descriptions>

      {access.sinhVien && giangVien && (
        <>
          <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Cố vấn học tập</h4>
          <List
            grid={{
              xs: 1,
              xl: 3,
              sm: 2,
              lg: 3,
              md: 2,
              xxl: 4,
            }}
            itemLayout="horizontal"
            dataSource={[{ ...giangVien }]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item?.avatar_path || teacherIcon} />}
                  title={
                    <>
                      Họ và tên: <b>{item?.name || 'Chưa cập nhật'}</b>
                    </>
                  }
                  description={
                    <>
                      <div>Email: {item?.email || '(Chưa cập nhật)'}</div>
                      <div>Số điện thoại: {item?.so_dien_thoai || '(Chưa cập nhật)'}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </>
      )}

      <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Danh sách sinh viên</h4>
      <DanhSachSinhVien data={danhSachSinhVien} isGiangVien={access.nhanVien} />
    </>
  );
};

export default ThongTinChungLopHanhChinh;
