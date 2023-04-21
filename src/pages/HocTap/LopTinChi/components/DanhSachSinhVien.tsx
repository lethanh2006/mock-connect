import studentIcon from '@/assets/student.png';
import TableBaseStatic from '@/components/Table/Table';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { Avatar, Col, Descriptions, Modal, Row, Tabs } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import DiemCong from './DiemCong';
import VangDiemDanh from './VangDiemDanh';
import { type IColumn } from '@/components/Table/typing';

const DanhSachSinhVien = (props: {
  data: LopTinChi.ThongTinSinhVien[];
  loading: boolean;
  idLopTinChi?: number;
  isGiangVien?: boolean;
}) => {
  const { getThongTinChungLopTinChi, record: recordLopTinChi } = useModel('hoctap.loptinchi');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<LopTinChi.ThongTinSinhVien>();
  const { data, loading, idLopTinChi, isGiangVien } = props;

  const onRow = (rec: LopTinChi.ThongTinSinhVien) => ({
    onClick: () => {
      setRecord(rec);
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  let columns: IColumn<LopTinChi.ThongTinSinhVien>[] = [
    {
      dataIndex: 'avatar_path',
      title: 'Ảnh',
      width: 80,
      align: 'center',
      render: (path) => <Avatar src={path || studentIcon} />,
    },
    {
      dataIndex: 'name',
      title: 'Họ tên',
      width: 120,
      filterType: 'string',
    },
    {
      dataIndex: 'ma_dinh_danh',
      title: 'Mã sinh viên',
      width: 80,
      align: 'center',
      filterType: 'string',
    },
  ];

  if (isGiangVien)
    columns = columns.concat([
      {
        dataIndex: 'tong_diem_cong',
        title: 'Điểm cộng',
        width: 60,
        align: 'center',
        search: 'sort',
      },
      {
        dataIndex: 'vang_co_phep',
        title: 'Vắng có phép',
        width: 60,
        align: 'center',
        search: 'sort',
      },
      {
        dataIndex: 'vang_khong_phep',
        title: 'Vắng không phép',
        width: 60,
        align: 'center',
        search: 'sort',
      },
    ]);

  return (
    <>
      <TableBaseStatic
        otherProps={{ loading, onRow }}
        data={data.map((item, index) => ({
          ...item,
          index: index + 1,
          tong_diem_cong: _.sumBy(item.diemCong, (i) => i.soDiemCong),
          vang_khong_phep: item.soBuoiVang?.length ?? 0,
          vang_co_phep: item.soBuoiVangCoPhep?.length ?? 0,
        }))}
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

          {isGiangVien && (
            <Col span={24}>
              <Tabs>
                <Tabs.TabPane tab="Điểm cộng" key="1">
                  <DiemCong
                    data={record?.diemCong ?? []}
                    ma_dinh_danh={record?.ma_dinh_danh ?? ''}
                    lop_tin_chi_id={idLopTinChi ?? 0}
                    getData={() => {
                      getThongTinChungLopTinChi(recordLopTinChi.id).then(
                        (response: LopTinChi.ThongTinChungLopTinChiRecord) => {
                          setRecord((rec) =>
                            response?.sinhVienList?.find((item) => item.id === rec?.id),
                          );
                        },
                      );
                    }}
                  />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Vắng điểm danh" key="2">
                  <VangDiemDanh data={record?.soBuoiVang?.concat(record.soBuoiVangCoPhep) ?? []} />
                </Tabs.TabPane>
              </Tabs>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};

export default DanhSachSinhVien;
