import { getDetailTinTuc } from '@/services/ant-design-pro/api';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Spin } from 'antd';
import moment from 'moment';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import './styles.less';

const ChiTietTinTuc = () => {
  const [record, setRecord] = useState<TinTuc.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const { location } = window;
  const { id } = queryString.parse(location.search);

  // const [dsLq, setDsLq] = useState([]);

  const fetchData = async () => {
    setLoading(true);

    try {
      getDetailTinTuc(id).then((response) => {
        setRecord(response.data?.data);
        // const resLq = await axios.get(`${ip}/tin-tuc/v2/${id}/related`);
        // setDsLq(resLq?.data?.data.slice(0, 5) ?? []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } catch (error) {
      window.history.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
              <h4>{record?.tieuDe ?? ''}</h4>
              <p className="ngay-dang">
                {record?.ngayDang && moment(record?.ngayDang).format('DD MMMM YYYY, HH:mm ')}
                <Divider type="vertical" />
                {record?.nguoiDang?.fullname}
              </p>
              {record?.moTa !== '' && <p className="mo-ta">{record?.moTa}</p>}

              <div
                className="noi-dung"
                dangerouslySetInnerHTML={{ __html: record?.noiDung ?? '' }}
              />
            </div>
          </Col>

          {/* <Col lg={7} span={24}>
            {dsLq.length > 0 && (
              <Card className="card-relate" title="Tin tức khác" bordered={false}>
                <List
                  dataSource={dsLq}
                  renderItem={(item: any) => (
                    <List.Item key={item._id} style={{ height: '100%' }}>
                      <List.Item.Meta
                        avatar={<Avatar src={_.get(item, 'anhDaiDien', '')} />}
                        title={
                          <a
                            onClick={async () => {
                              history.push({
                                pathname: `/${type}/chi-tiet`,
                                query: {
                                  id: item?._id,
                                },
                              });
                            }}
                          >
                            <Typography.Title
                              style={{ fontWeight: 'normal' }}
                              level={5}
                              ellipsis={{ rows: 2 }}
                            >
                              {_.get(item, 'tieuDe', '')}
                            </Typography.Title>
                          </a>
                        }
                      />
                    </List.Item>
                  )}
                />
                <Divider />
              </Card>
            )}
          </Col> */}
        </Row>
      </Spin>
    </Card>
  );
};

export default ChiTietTinTuc;
