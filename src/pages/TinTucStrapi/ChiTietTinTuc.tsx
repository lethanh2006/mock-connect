import { AlignLeftOutlined, ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Spin } from 'antd';
import moment from 'moment';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './styles.less';

const ChiTietTinTucPage = () => {
  const { getByIdModel, loading, record } = useModel('tintuc.tintucstrapi');
  const { location } = window;
  const { slug, type } = queryString.parse(location.search);

  const fetchData = async () => {
    try {
      getByIdModel(slug as string, type as string).then((response) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } catch (error) {
      window.history.back();
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug, type]);

  return (
    <Card
      title={
        <span onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>
          <ArrowLeftOutlined /> Quay lại
        </span>
      }
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify="center">
          <Col lg={17} span={24}>
            <div id="content">
              <h4>{record?.title ?? ''}</h4>
              <p className="ngay-dang">
                <CalendarOutlined />{' '}
                {record?.updatedAt && moment(record?.updatedAt).format('DD MMMM YYYY, HH:mm ')}
                <Divider type="vertical" />
                <AlignLeftOutlined /> {record?.category?.title}
              </p>
              {record?.description !== '' && <p className="mo-ta">{record?.description}</p>}

              <div
                className="noi-dung"
                dangerouslySetInnerHTML={{ __html: record?.content ?? '' }}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default ChiTietTinTucPage;
