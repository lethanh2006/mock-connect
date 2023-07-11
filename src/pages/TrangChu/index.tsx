import CalendarPage from '@/pages/Calendar';
import { Col, Row } from 'antd';
import TinTucDashboard from '../TinTucStrapi/TinTucDashboard';

const TrangChu = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        {/* <BlockSinhVien /> */}

        <Col xs={24} lg={14} xl={16}>
          <CalendarPage isDashboard />
        </Col>

        <Col xs={24} lg={10} xl={8}>
          <TinTucDashboard />
        </Col>
      </Row>
    </>
  );
};

export default TrangChu;
