import anh from '@/assets/noimg.png';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Spin, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import { renderParagraph } from './BlockTinTuc';
import { CardTinTuc } from './TinTuc.style';
import './styles.less';

const TinTucDashboard = () => {
  const { danhSach, getModel, loading } = useModel('tintuc.tintuc');

  useEffect(() => {
    getModel(undefined, undefined, undefined, 1, 5);
  }, []);

  return (
    <Card title="Tin tức">
      <Spin spinning={loading}>
        {danhSach && danhSach.length > 0 ? (
          <>
            <Row gutter={[12, 12]} style={{ alignItems: 'stretch', marginBottom: 12 }}>
              {danhSach.map((tintuc) => (
                <Col span={24} key={tintuc?._id}>
                  <CardTinTuc
                    style={{ height: '100%' }}
                    onClick={() => {
                      history.push({
                        pathname: 'tin-tuc/chi-tiet',
                        query: { id: tintuc?._id },
                      });
                    }}
                  >
                    <Row gutter={12} style={{ height: '100%' }}>
                      <Col xs={8}>
                        <div
                          style={{
                            background: tintuc?.urlAnhDaiDien
                              ? `url(${tintuc?.urlAnhDaiDien}) center center/ cover no-repeat`
                              : `url(${anh}) center center/ cover no-repeat`,
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </Col>
                      <Col xs={16}>
                        <Tooltip title={tintuc?.tieuDe}>
                          {renderParagraph(tintuc?.tieuDe, 3, {
                            fontWeight: 600,
                            marginBottom: 6,
                            color: 'black',
                          })}
                        </Tooltip>
                        {tintuc?.ngayDang && (
                          <span className="thoi-gian">
                            {moment(tintuc?.ngayDang).format('HH:mm DD/MM/YYYY')}
                          </span>
                        )}
                      </Col>
                    </Row>
                  </CardTinTuc>
                </Col>
              ))}
            </Row>

            <Button
              type="link"
              onClick={() => {
                history.push('/tin-tuc');
              }}
            >
              Xem thêm <ArrowRightOutlined />
            </Button>
          </>
        ) : (
          <Empty style={{ paddingTop: 32 }} description="Chưa có tin tức" />
        )}
      </Spin>
    </Card>
  );
};

export default TinTucDashboard;
