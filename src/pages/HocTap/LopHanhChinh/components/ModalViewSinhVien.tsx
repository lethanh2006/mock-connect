import studentIcon from '@/assets/student.png';
import { Avatar, Col, Descriptions, Modal, Row, Tabs } from 'antd';
import moment from 'moment';

const ModalViewSinhVien = (props: {
  visible: boolean;
  setVisible: any;
  record?: LopHanhChinh.ISinhVien;
  isGiangVien?: boolean;
}) => {
  const { visible, setVisible, record, isGiangVien } = props;
  return (
    <Modal
      title="Thông tin sinh viên"
      visible={visible}
      onCancel={() => setVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={900}
      bodyStyle={{ paddingTop: 0 }}
    >
      <Tabs>
        <Tabs.TabPane tab="Thông tin chung" key="1">
          <Row align="middle" gutter={[0, 12]}>
            <Col span={24} md={8} style={{ textAlign: 'center' }}>
              <Avatar
                src={record?.avatar_path || studentIcon}
                size={{ xs: 80, sm: 128, md: 128, lg: 160, xl: 160, xxl: 160 }}
              />
            </Col>
            <Col span={24} md={16}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và tên">{record?.ten}</Descriptions.Item>
                <Descriptions.Item label="Mã sinh viên">{record?.ma}</Descriptions.Item>
                <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{record?.gioiTinh ?? ''}</Descriptions.Item>
                {isGiangVien && (
                  <>
                    <Descriptions.Item label="Ngày sinh">
                      {record?.ngaySinh &&
                        moment(record.ngaySinh, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số điện thoại">
                      {record?.soDienThoai}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Col>
          </Row>
        </Tabs.TabPane>

        {isGiangVien && (
          <Tabs.TabPane tab="Kết quả học tập" key="2">
            Kết quả học tập sinh viên
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default ModalViewSinhVien;
