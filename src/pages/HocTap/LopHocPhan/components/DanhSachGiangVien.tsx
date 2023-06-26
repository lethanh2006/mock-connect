import teacherIcon from '@/assets/teacher.png';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Avatar, List } from 'antd';

const DanhSachGiangVien = (props: {
  danhSachNhanSu?: LopHocPhan.IRecordNhanSuLopHP[];
  title?: string;
}) => {
  const { danhSachNhanSu, title } = props;

  return (
    <>
      <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>
        {title ?? 'Giảng viên'}
      </h4>
      {danhSachNhanSu?.length ? (
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
          dataSource={danhSachNhanSu}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item?.nhanSu?.urlAnhDaiDien || teacherIcon} />}
                title={<>Họ và tên: {item?.nhanSu?.ten || <i>Chưa cập nhật</i>}</>}
                description={
                  <>
                    <div>Email: {item?.nhanSu?.email || <i>Chưa cập nhật</i>}</div>
                    <div>Số điện thoại: {item?.nhanSu?.sdtCaNhan || <i>Chưa cập nhật</i>}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ marginBottom: 24 }}>Không có thông tin giảng viên</div>
      )}
    </>
  );
};

export default DanhSachGiangVien;
