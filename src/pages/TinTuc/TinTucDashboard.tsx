import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import BlockTinTuc from './BlockTinTuc';
import './styles.less';

const TinTucDashboard = () => {
  const { danhSach, getModel, loading } = useModel('tintuc.tintuc');

  useEffect(() => {
    getModel(undefined, undefined, undefined, 1, 5);
  }, []);

  return (
    <Card title="Tin tức">
      {danhSach && danhSach.length > 0 ? (
        <Spin spinning={loading}>
          <BlockTinTuc type="dashboard" />

          <Button
            type="link"
            onClick={() => {
              history.push('/tin-tuc');
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
