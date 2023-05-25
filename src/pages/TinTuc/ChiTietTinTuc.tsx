import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Spin } from 'antd';
import moment from 'moment';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import './styles.less';
import { getDetailTinTuc } from '@/services/TinTuc/tintuc';

const ChiTietTinTuc = () => {
  const [record, setRecord] = useState<TinTuc.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const { location } = window;
  const { id } = queryString.parse(location.search);

  const fetchData = async () => {
    setLoading(true);

    try {
      getDetailTinTuc(id).then((response) => {
        setRecord(response.data?.data);
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
        </Row>
      </Spin>
    </Card>
  );
};

export default ChiTietTinTuc;
