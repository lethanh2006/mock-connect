import { Col, Row } from 'antd';
import BlockSinhVien from './components/BlockSinhVien';
import ThoiKhoaBieu from '@/pages/Calendar';
import TinTucDashboard from '../TinTuc/TinTucDashboard';

const TrangChu = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <BlockSinhVien />

        <Col xs={24} lg={14} xl={16}>
          <ThoiKhoaBieu type="dashboard" />
        </Col>

        <Col xs={24} lg={10} xl={8}>
          <TinTucDashboard />
        </Col>
      </Row>
    </>
  );
};

export default TrangChu;
