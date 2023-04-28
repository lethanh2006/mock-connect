import { restoreLichTuan } from '@/services/LichTuan/lichtuan';
import type { LichTuan } from '@/services/LichTuan/typings';
import type { IColumn } from '@/utils/interfaces';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Select, Table, Tabs, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const ModalPhatHanhLichTuan = (props: { week: any; year: any }) => {
  const {
    getModel,
    getBanChinhThucModel,
    phatHanhLichTuanModel,
    previewPhatHanhLichTuanModel,
    danhSachPreview,
    visiblePreview,
    setVisiblePreview,
  } = useModel('lichtuan');
  const [trangThaiPreview, setTrangThaiPreview] = useState<string | undefined>('MOI_PHAT_HANH');
  const [thongBao, setThongBao] = useState<'Toàn nhân viên' | 'Thành phần tham gia'>(
    'Toàn nhân viên',
  );
  const [loadingRestore, setLoadingRestore] = useState(false);
  const { week, year } = props;
  const mom = moment().set('week', week).set('year', year);

  const phatHanhLichTuan = () => {
    phatHanhLichTuanModel(week, year, thongBao);
  };

  // Columns Xem trước lịch tuần
  const columns: IColumn<LichTuan.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
      align: 'center',
    },
    {
      title: 'Thời gian',
      align: 'center',
      width: 120,
      render: (val, rec) => (
        <>
          {moment(rec.thoiGianBatDau).format('HH:mm DD/MM/yyyy')}
          <br />
          {moment(rec.thoiGianKetThuc).format('HH:mm DD/MM/yyyy')}
        </>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDungCongViec',
      width: 200,
      align: 'center',
    },
    {
      title: 'Chủ trì',
      dataIndex: 'chuTri',
      width: 120,
      align: 'center',
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val?.map((item: any) => item.ten).join(', ')}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'diaDiem',
      width: 120,
      align: 'center',
      render: (val) => <>{val?.value ?? ''}</>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 150,
    },
  ];

  return (
    <Modal
      destroyOnClose
      onCancel={() => {
        setVisiblePreview(false);
        setTrangThaiPreview('MOI_PHAT_HANH');
      }}
      visible={visiblePreview}
      title={`Xem trước lịch công tác tuần ${week} (từ ${mom
        .startOf('week')
        .format('DD/MM')} đến ${mom.endOf('week').format('DD/MM')})`}
      width={1100}
      footer={[
        <Popconfirm
          onConfirm={() => {
            phatHanhLichTuan();
            setVisiblePreview(false);
            setTrangThaiPreview('MOI_PHAT_HANH');
          }}
          title="Bạn có chắc chắn muốn phát hành lịch tuần?"
          key="1"
        >
          <Button type="primary" key={'ok'}>
            Phát hành lịch tuần
          </Button>
        </Popconfirm>,
        <Button
          onClick={() => {
            setVisiblePreview(false);
            setTrangThaiPreview('MOI_PHAT_HANH');
          }}
          key={'close'}
        >
          Đóng
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 8 }}>
        Danh sách các mục lịch công tác thay đổi so với lần phát hành gần nhất. Vui lòng kiểm tra
        lại trước khi <b>Phát hành lịch tuần</b>.
      </div>
      <Tabs
        onChange={(key: string) => {
          setTrangThaiPreview(key);
        }}
        activeKey={trangThaiPreview}
        defaultActiveKey="MOI_PHAT_HANH"
      >
        <Tabs.TabPane
          tab={`Lịch thêm mới (${danhSachPreview?.lichMoiPhatHanh?.length ?? 0})`}
          key="MOI_PHAT_HANH"
        />
        <Tabs.TabPane
          tab={`Lịch sửa lại (${danhSachPreview?.lichSuaLai?.length ?? 0})`}
          key="SUA_LAI"
        />
        <Tabs.TabPane
          tab={`Lịch bị xóa (${danhSachPreview?.lichBiXoa?.length ?? 0})`}
          key="BI_XOA"
        />
      </Tabs>

      {trangThaiPreview === 'MOI_PHAT_HANH' && (
        <Table
          loading={loadingRestore}
          dataSource={danhSachPreview?.lichMoiPhatHanh?.map((values: any, i: number) => ({
            ...values,
            index: i + 1,
          }))}
          columns={columns}
          pagination={false}
          size="small"
        />
      )}
      {trangThaiPreview === 'SUA_LAI' && (
        <Table
          loading={loadingRestore}
          dataSource={danhSachPreview?.lichSuaLai?.map((values: any, i: number) => {
            return { ...values, index: i + 1 };
          })}
          columns={[
            ...columns,
            {
              title: 'Nội dung chỉnh sửa',
              dataIndex: 'chiTietThayDoi',
              width: 200,
              align: 'center',
              render: (val) => (
                <Typography.Paragraph
                  ellipsis={{ rows: 3, expandable: true, symbol: <span>Xem tiếp</span> }}
                >
                  {val?.map((item: any, index: number) => (
                    <>
                      {item?.array?.length ? (
                        <>
                          Người thay đổi: {item?.nguoiSua?.name ?? 'Chưa xác định'} (
                          {item?.nguoiSua?.maDinhDanh ?? 'Chưa xác định'})
                          <ul>
                            {item?.array?.map((element: any) => (
                              <li key={element?.value}>{element?.value ?? ''}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </>
                  ))}
                </Typography.Paragraph>
              ),
            },
          ]}
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
        />
      )}
      {trangThaiPreview === 'BI_XOA' && (
        <Table
          loading={loadingRestore}
          dataSource={danhSachPreview?.lichBiXoa?.map((values: any, i: number) => {
            return { ...values, index: i + 1 };
          })}
          size="small"
          columns={[
            ...columns,
            {
              title: 'Thao tác',
              align: 'center',
              width: 60,
              fixed: 'right',
              render: (_: any) => (
                <Tooltip title="Khôi phục">
                  <Button
                    onClick={async () => {
                      setLoadingRestore(true);
                      await restoreLichTuan(_._id);
                      previewPhatHanhLichTuanModel(week, year);
                      getBanChinhThucModel();
                      getModel();
                      setLoadingRestore(false);
                    }}
                    type="primary"
                    shape="circle"
                  >
                    <ReloadOutlined />
                  </Button>
                </Tooltip>
              ),
            },
          ]}
          pagination={false}
        />
      )}
      <h3 style={{ marginTop: '40px', display: 'inline' }}>Đối tượng nhận thông báo</h3>
      <Select
        placeholder="Lựa chọn đối tượng nhận thông báo"
        defaultValue="Toàn nhân viên"
        onChange={(value: any) => setThongBao(value)}
        style={{ width: '250px', marginBottom: '10px', marginTop: '20px', marginLeft: '12px' }}
      >
        <Select.Option value="Toàn nhân viên">Toàn trường</Select.Option>
        <Select.Option value="Thành phần tham gia">Các thành phần tham gia</Select.Option>
      </Select>
    </Modal>
  );
};

export default ModalPhatHanhLichTuan;
