import { ellipse } from '@/utils/utils';
import { Card, Empty, Pagination, Spin, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BlockTinTuc from './BlockTinTuc';
import './styles.less';

const TinTucPage = () => {
  const {
    getAllModel: getAllChuDe,
    danhSach: danhSachChuDe,
    setRecord: setChuDe,
    record: recChuDe,
  } = useModel('tintuc.chude');
  const { loading, page, limit, total, setPage, setLimit, getModel } = useModel('tintuc.tintuc');
  const hash = window.location.hash.slice(1, 25);

  useEffect(() => {
    getAllChuDe().then((listMenu) => {
      if (hash === '' || hash.includes('=')) setChuDe(listMenu?.[0]);
      else setChuDe(listMenu.find((item) => item._id === hash));
    });
  }, []);

  useEffect(() => {
    getModel({ idTopic: recChuDe?._id });
  }, [page, limit, recChuDe?._id]);

  const changeMenu = (k: string) => {
    setChuDe(danhSachChuDe.find((item) => item._id === k));
    window.location.hash = '#' + k;
    setPage(1);
  };

  const onChangePaging = (p: number, size: number) => {
    setPage(p);
    setLimit(size);
  };

  return (
    <Card title="Tin tức" bodyStyle={{ paddingTop: 0 }}>
      {danhSachChuDe && danhSachChuDe.length > 0 ? (
        <Tabs activeKey={recChuDe?._id} onChange={changeMenu} style={{ overflow: 'inherit' }}>
          {danhSachChuDe?.map((chuDe) => (
            <Tabs.TabPane
              key={chuDe?._id}
              tab={
                <Tooltip title={chuDe?.name}>
                  {recChuDe?._id === chuDe?._id ? chuDe.name : ellipse(chuDe?.name)}
                </Tooltip>
              }
            >
              <Spin spinning={loading}>
                <BlockTinTuc />

                <Pagination
                  onChange={onChangePaging}
                  defaultPageSize={22}
                  current={page}
                  pageSize={limit}
                  total={total}
                  pageSizeOptions={[10, 22, 34]}
                  style={{ textAlign: 'right' }}
                />
              </Spin>
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : (
        <Empty style={{ paddingTop: 32 }} description="Chưa có tin tức" />
      )}
    </Card>
  );
};

export default TinTucPage;
