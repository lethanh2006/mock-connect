import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import type { IColumn } from '@/utils/interfaces';
import { Card, DatePicker, Table, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';

const XemDonMuon = () => {
  const { getAllPhongKhaDungModel, danhSach, getAllPhongKhongKhaDungModel, loading, setRecord } =
    useModel('quantriphonghop');
  const { setVisibleForm, getAllBieuMauModel } = useModel('dichvumotcuav2');
  const [dateFilter, setDateFilter] = useState<{
    thoiGianBd: string;
    thoiGianKt: string;
  }>({
    thoiGianBd: moment().add(1, 'days').set('hour', 7).set('minute', 0).toISOString(),
    thoiGianKt: moment().add(1, 'days').set('hour', 9).set('minute', 0).toISOString(),
  });
  const [trangThai, setTrangThai] = useState<'OK' | 'NOT_OK'>('OK');
  const access = useAccess();
  const isQuanLy = access.adminAccessFilter({ maChucNang: 'quan-ly-muon-phong-hop' });
  const canCreateDon = access.accessFilter({ maChucNang: 'don-van-phong-so:create' });

  useEffect(() => {
    getAllBieuMauModel('VAN_PHONG_SO'); // get biểu mẫu để render form động
  }, []);

  useEffect(() => {
    if (trangThai === 'OK') {
      getAllPhongKhaDungModel(dateFilter);
    } else {
      getAllPhongKhongKhaDungModel(dateFilter);
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

  const columns: IColumn<VanphongsoCsvc.PhongHopRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tòa nhà',
      dataIndex: ['info', 'toaNha'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Tên phòng',
      dataIndex: ['info', 'tenPhong'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Số phòng',
      dataIndex: ['info', 'soPhong'],
      align: 'center',
      width: 150,
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
    //               pathname: '/vanphongso/phonghop/dondangky',
    //               state: {
    //                 dataVps: {
    //                   ngayGioMuon: dateFilter?.thoiGianBd,
    //                   ngayGioTra: dateFilter?.thoiGianKt,
    //                   typeVps: 'PHONG_HOP',
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
          <div>Trạng thái phòng họp theo thời gian</div>
          <DatePicker.RangePicker
            allowClear={false}
            format="HH:mm DD/MM/YYYY"
            minuteStep={15}
            defaultValue={[
              moment(moment().add(1, 'days').set('hour', 7).set('minute', 0), 'HH:mm DD/MM/YYYY'),
              moment(moment().add(1, 'days').set('hour', 9).set('minute', 0), 'HH:mm DD/MM/YYYY'),
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
        columns={columns.filter((item) => !item.hide)}
        pagination={false}
      />
    </Card>
  );
};

export default XemDonMuon;
