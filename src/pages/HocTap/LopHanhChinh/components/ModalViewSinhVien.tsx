import studentIcon from '@/assets/student.png';
import { Avatar, Col, Descriptions, Modal, Row, Tabs } from 'antd';
import moment from 'moment';
import KetQuaHocTapSinhVien from './KetQuaHocTap';
import { type APILopHanhChinh } from '@/services/LopHanhChinh';

const ModalViewSinhVien = (props: {
  visible: boolean;
  setVisible: any;
  record?: APILopHanhChinh.ISinhVienDiemHanhChinh;
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
                <Descriptions.Item label="Họ và tên">{record?.name}</Descriptions.Item>
                <Descriptions.Item label="Mã sinh viên">{record?.ma_dinh_danh}</Descriptions.Item>
                <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {record?.gioi_tinh === '0' ? 'Nam' : 'Nữ'}
                </Descriptions.Item>
                {isGiangVien && (
                  <>
                    <Descriptions.Item label="Ngày sinh">
                      {record?.ngay_sinh &&
                        moment(record.ngay_sinh, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số điện thoại">
                      {record?.so_dien_thoai}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Col>
          </Row>
        </Tabs.TabPane>

        {isGiangVien && (
          <Tabs.TabPane tab="Kết quả học tập" key="2">
            <KetQuaHocTapSinhVien sinhVien={record} />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default ModalViewSinhVien;
