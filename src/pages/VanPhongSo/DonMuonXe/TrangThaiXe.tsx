import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import type { IColumn } from '@/utils/interfaces';
import { Card, DatePicker, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';

const XemDonMuon = () => {
  const { getXeKhaDungModel, loading, danhSach, getXeKhongKhaDungModel } =
    useModel('quantrixecong');
  // const { setVisibleForm, getAllBieuMauModel } = useModel('dichvumotcuav2');
  const [dateFilter, setDateFilter] = useState<{
    thoiGianBd: string;
    thoiGianKt: string;
  }>({
    thoiGianBd: moment().add(1, 'days').set('hour', 7).set('minute', 0).toISOString(),
    thoiGianKt: moment().add(1, 'days').set('hour', 9).set('minute', 0).toISOString(),
  });
  const [trangThai, setTrangThai] = useState<'OK' | 'NOT_OK'>('OK');
  const access = useAccess();
  const isQuanLy = access.adminAccessFilter({ maChucNang: 'quan-ly-muon-xe-cong' });
  // const canCreateDon = access.accessFilter({ maChucNang: 'don-van-phong-so:create' });

  useEffect(() => {
    // getAllBieuMauModel('VAN_PHONG_SO'); // get biểu mẫu để render form động
  }, []);

  useEffect(() => {
    if (trangThai === 'OK') {
      getXeKhaDungModel(dateFilter);
    } else {
      getXeKhongKhaDungModel(dateFilter);
    }
  }, [trangThai, dateFilter]);

  const handleFilterDonTheoThoiGian = (values: any) => {
    if (values) {
      const ngayBatDau = values?.[0];
      const ngayKetThuc = values?.[1];
      const timeStartString = moment(ngayBatDau).toISOString();
      const timeEndString = moment(ngayKetThuc).toISOString();
      setDateFilter({ thoiGianBd: timeStartString, thoiGianKt: timeEndString });
    } else {
      setDateFilter({} as any);
    }
  };

  const columns: IColumn<VanphongsoCsvc.XeRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      search: 'search',
      width: 80,
    },
    {
      title: 'Tên xe',
      dataIndex: ['info', 'tenXe'],
      align: 'center',
      search: 'search',
      width: 150,
    },
    {
      title: 'Biển số xe',
      dataIndex: ['info', 'bienSoXe'],
      align: 'center',
      search: 'search',
      width: 200,
    },
    {
      title: 'Loại xe',
      dataIndex: ['info', 'loaiXe'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Ghi chú',
      dataIndex: ['info', 'ghiChu'],
      align: 'center',
      width: 200,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 90,
    //   fixed: 'right',
    //   hide: !canCreateDon || trangThai === 'NOT_OK',
    //   render: (rec) => {
    //     return (
    //       <Tooltip title="Tạo đơn">
    //         <Button
    //           type="primary"
    //           shape="circle"
    //           icon={<PlusOutlined />}
    //           onClick={() => {
    //             setRecord(rec);
    //             history.push({
    //               pathname: '/vanphongso/xecong/dondangky',
    //               state: {
    //                 dataVps: {
    //                   ngayGioMuon: dateFilter?.thoiGianBd,
    //                   ngayGioTra: dateFilter?.thoiGianKt,
    //                   typeVps: 'XE_CONG',
    //                 },
    //               },
    //             });
    //             setVisibleForm(true);
    //           }}
    //         />
    //       </Tooltip>
    //     );
    //   },
    // },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>Trạng thái xe công theo thời gian</div>
          <DatePicker.RangePicker
            format="HH:mm DD/MM/YYYY"
            minuteStep={15}
            allowClear={false}
            defaultValue={[
              moment(moment().add(1, 'days').set('hour', 7).set('minute', 0), 'HH:mm DD/MM/YYYY'),
              moment(moment().add(1, 'days').set('hour', 11).set('minute', 0), 'HH:mm DD/MM/YYYY'),
            ]}
            style={{ width: '400px', marginLeft: 12 }}
            onChange={(value) => handleFilterDonTheoThoiGian(value)}
            placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
            showTime
          />
        </div>
      }
      bodyStyle={{ paddingTop: '8px' }}
    >
      <Tabs
        onChange={(key: any) => {
          setTrangThai(key);
        }}
        activeKey={trangThai}
        defaultActiveKey="OK"
      >
        <Tabs.TabPane tab="Khả dụng" key="OK" />
        {isQuanLy && <Tabs.TabPane tab="Không khả dụng" key="NOT_OK" />}
      </Tabs>

      <Table
        loading={loading}
        dataSource={danhSach?.map((values: any, i: number) => {
          return { ...values, index: i + 1 };
        })}
        columns={columns?.filter((item) => !item.hide)}
        pagination={false}
      />
    </Card>
  );
};

export default XemDonMuon;
