import studentIcon from '@/assets/student.png';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { Avatar, Col, Descriptions, Modal, Row } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const DanhSachSinhVien = (props: { isThucHanh: boolean }) => {
  const { record: recordLopTinChi, loading } = useModel('daotao.lophocphan');
  const { record: recLopThucHanh } = useModel('daotao.lopthuchanh');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<SinhVien.IRecord>();

  const onRow = (rec: SinhVien.IRecord) => ({
    onClick: () => {
      setRecord(rec);
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<SinhVien.IRecord>[] = [
    {
      dataIndex: 'anhDaiDienUrl',
      title: 'Ảnh đại diện',
      width: 80,
      align: 'center',
      render: (path) => <Avatar src={path || studentIcon} />,
    },
    {
      dataIndex: 'ma',
      title: 'Mã sinh viên',
      width: 120,
      filterType: 'string',
    },
    {
      dataIndex: 'ten',
      title: 'Họ tên',
      width: 150,
      filterType: 'string',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      width: 100,
    },
  ];

  return (
    <>
      <TableStaticData
        otherProps={{ loading, onRow }}
        data={
          props.isThucHanh
            ? recLopThucHanh?.sinhVienList ?? []
            : recordLopTinChi?.sinhVienList ?? []
        }
        columns={columns}
        addStt
      />

      <Modal
        title="Thông tin sinh viên"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
        width={800}
      >
        <Row align="middle" gutter={[0, 12]}>
          <Col span={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar
              src={record?.anhDaiDienUrl || studentIcon}
              size={{ xs: 80, sm: 128, md: 128, lg: 160, xl: 160, xxl: 160 }}
            />
          </Col>
          <Col span={24} md={16}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Họ và tên">{record?.ten}</Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">{record?.ma}</Descriptions.Item>
              <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{record?.gioiTinh ?? ''}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {record?.ngaySinh && moment(record.ngaySinh).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{record?.soDienThoai}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default DanhSachSinhVien;
