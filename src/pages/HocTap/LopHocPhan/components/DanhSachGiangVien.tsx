import teacherIcon from '@/assets/teacher.png';
import { Avatar, List } from 'antd';

const DanhSachGiangVien = (props: {
  danhSachNhanSu?: (Partial<ToChucNhanSu.INhanSu> | undefined)[];
  title?: string;
}) => {
  const { title, danhSachNhanSu } = props;

  return (
    <>
      <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>{title ?? 'Giảng viên'}</h4>
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
                avatar={<Avatar src={item?.urlAnhDaiDien || teacherIcon} />}
                title={<>Họ và tên: {item?.ten || <i>Chưa cập nhật</i>}</>}
                description={
                  <>
                    <div>Email: {item?.email || <i>Chưa cập nhật</i>}</div>
                    <div>Số điện thoại: {item?.sdtCaNhan || <i>Chưa cập nhật</i>}</div>
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
