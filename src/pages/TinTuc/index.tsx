import { getDataTinTuc } from '@/services/ant-design-pro/api';
import { ellipse } from '@/utils/utils';
import { Card, Empty, Pagination, Spin, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import BlockTinTuc from './BlockTinTuc';
import './styles.less';

const TinTucPage = () => {
  const { getAllChuDeModel, danhSach: danhSachChuDe } = useModel('chude');
  const access = useAccess();
  const [limitTinTucTheoTopic, setLimitTinTucTheoTopic] = useState<number>(10);
  const [pageTinTucTheoTopic, setPageTinTucTheoTopic] = useState<number>(1);
  const [danhSachTinTucTheoTopic, setDanhSachTinTucTheoTopic] = useState<TinTuc.Record[]>([]);
  const [totalTinTucTheoTopic, setTotalTinTucTheoTopic] = useState<number>();
  const [loading, setLoading] = useState(true);

  const hash = window.location.hash.slice(1, 25);
  const [key, setKey] = useState<string>(hash || '');

  const getData = async (page: number, limit: number, idTopic: string) => {
    const res: IRecordTinTuc.RootObject = await getDataTinTuc({
      page,
      limit,
      condition: { idTopic },
    });
    setTotalTinTucTheoTopic(res.data?.total);
    setDanhSachTinTucTheoTopic(res.data?.result ?? []);
    setLoading(false);
  };

  useEffect(() => {
    getAllChuDeModel(access.nhanVien ? { phamVi: 'Tất cả' } : {}).then((listMenu) => {
      const k = key === '' || key.includes('=') ? listMenu?.[0]?._id : key;
      if (key !== k) setKey(k);
      getData(1, limitTinTucTheoTopic, k);
    });
  }, []);

  const changeMenu = (k: string) => {
    setKey(k);
    window.location.hash = '#' + k;
    setPageTinTucTheoTopic(1);
    setLoading(true);
    getData(1, limitTinTucTheoTopic, k);
  };

  const onChangePaging = (page: number, size: number) => {
    setPageTinTucTheoTopic(page);
    setLimitTinTucTheoTopic(size);
    setLoading(true);
    getData(page, size, key);
  };

  console.log(danhSachChuDe, 'ds chu de');
  console.log(danhSachTinTucTheoTopic, 'danhSachTinTucTheoTopic');
  return (
    <Card title="Tin tức" bodyStyle={{ paddingTop: 0 }}>
      {danhSachChuDe && danhSachChuDe.length > 0 ? (
        <Tabs activeKey={key} onChange={changeMenu}>
          {danhSachChuDe?.map((chuDe) => (
            <Tabs.TabPane
              key={chuDe?._id}
              tab={
                <Tooltip title={chuDe?.name}>
                  {key === chuDe?._id ? chuDe.name : ellipse(chuDe?.name)}
                </Tooltip>
              }
            >
              <Spin spinning={loading}>
                <BlockTinTuc data={danhSachTinTucTheoTopic} />
                <Pagination
                  onChange={onChangePaging}
                  defaultPageSize={22}
                  current={pageTinTucTheoTopic}
                  pageSize={limitTinTucTheoTopic}
                  total={totalTinTucTheoTopic}
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
