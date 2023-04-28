import ThongTinTongHop from './components/ThongTinTongHop';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Tabs } from 'antd';
import TableQuanLyDonAdmin from './components/TableQuanLyDon';

const ThongTinTongHopAdmin = () => {
  const { setTrangThaiQuanLyDon, trangThaiQuanLyDon, setPage } = useModel('dichvumotcuav2');

  useEffect(() => {
    return () => {
      setTrangThaiQuanLyDon('PROCESSING');
    };
  }, []);

  return (
    <>
      <ThongTinTongHop />
      <Card title="Danh sách đơn" bodyStyle={{ paddingTop: 8 }}>
        <Tabs
          onChange={(key: string) => {
            setPage(1);
            setTrangThaiQuanLyDon(key);
          }}
          activeKey={trangThaiQuanLyDon}
          defaultActiveKey="PROCESSING"
        >
          <Tabs.TabPane tab="Chờ xử lý" key="PROCESSING" />
          <Tabs.TabPane tab="Duyệt" key="OK" />
          <Tabs.TabPane tab="Không duyệt" key="NOT_OK" />
        </Tabs>
        <TableQuanLyDonAdmin />
      </Card>
    </>
  );
};

export default ThongTinTongHopAdmin;
