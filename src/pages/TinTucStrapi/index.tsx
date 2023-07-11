import { EChuDeStrapi, TenChuDeStrapi } from '@/services/TinTuc/constant';
import { ellipse } from '@/utils/utils';
import { Card, Pagination, Spin, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BlockTinTuc from './BlockTinTuc';
import './styles.less';

const TinTucPage = () => {
  const { loading, page, limit, total, setPage, setLimit, getModel, chuDe, setChuDe } =
    useModel('tintuc.tintucstrapi');
  const hash = (window.location.hash.slice(1, 25) as string) || 'dao-tao';

  useEffect(() => {
    const article = (hash as EChuDeStrapi) ?? EChuDeStrapi.DAO_TAO;
    setChuDe(article);
  }, [hash]);

  useEffect(() => {
    getModel();
  }, [page, limit, chuDe]);

  const changeMenu = (k: string) => {
    setChuDe(k as EChuDeStrapi);
    window.location.hash = '#' + k;
    setPage(1);
  };

  const onChangePaging = (p: number, size: number) => {
    setPage(p);
    setLimit(size);
  };

  return (
    <Card title="Tin tức" bodyStyle={{ paddingTop: 0 }}>
      <Tabs activeKey={chuDe} onChange={changeMenu} style={{ overflow: 'inherit' }}>
        {Object.values(EChuDeStrapi)?.map((article) => (
          <Tabs.TabPane
            key={article}
            tab={
              <Tooltip title={TenChuDeStrapi[article]}>
                {chuDe === article ? TenChuDeStrapi[article] : ellipse(TenChuDeStrapi[article])}
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
    </Card>
  );
};

export default TinTucPage;
