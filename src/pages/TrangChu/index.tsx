import ThoiKhoaBieu from '@/pages/Calendar';
import { Col, Row } from 'antd';
import { useAccess } from 'umi';
// import TinTucDashboard from '../TinTuc/TinTucDashboard';
// import BlockSinhVien from './components/BlockSinhVien';

const TrangChu = () => {
  const access = useAccess();
  return (
    <>
      <Row gutter={[20, 20]}>
        {/* {access.sinhVien && <BlockSinhVien />} */}
        <ThoiKhoaBieu type="dashboard" />
        {/* {access.sinhVienVaNhanVien && (
          <>
            <Col xs={24} lg={14} xl={16}>
              <ThoiKhoaBieu type="dashboard" />
            </Col>
            <Col xs={24} lg={10} xl={8}>
              <TinTucDashboard />
            </Col>
          </>
        )} */}
      </Row>
    </>
  );
};

export default TrangChu;
