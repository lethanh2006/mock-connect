import { getDataTinTuc } from '@/services/ant-design-pro/api';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import BlockTinTuc from './BlockTinTuc';
import { history } from 'umi';
import './styles.less';

const TinTucDashboard = () => {
  const [danhSachTinTucTheoTopic, setDanhSachTinTucTheoTopic] = useState<TinTuc.Record[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async (page: number, limit: number) => {
    const res: IRecordTinTuc.RootObject = await getDataTinTuc({
      page,
      limit,
    });
    setDanhSachTinTucTheoTopic(res.data?.result ?? []);
    setLoading(false);
  };

  useEffect(() => {
    getData(1, 5);
  }, []);

  return (
    <Card title="Tin tức">
      {danhSachTinTucTheoTopic && danhSachTinTucTheoTopic.length > 0 ? (
        <Spin spinning={loading}>
          <BlockTinTuc data={danhSachTinTucTheoTopic} type="dashboard" />
          <Button
            type="link"
            onClick={() => {
              history.push('/tintuc');
            }}
          >
            Xem thêm <ArrowRightOutlined />
          </Button>
        </Spin>
      ) : (
        <Empty style={{ paddingTop: 32 }} description="Chưa có tin tức" />
      )}
    </Card>
  );
};

export default TinTucDashboard;
