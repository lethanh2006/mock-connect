import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { Col, Row, Spin, Steps, Button, Popover } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ViewDetailHocKy from './ViewDetailHocKy';

const FilterDotDangKy = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const {
    getDotDangKyAvailableModel: getDotDangKy,
    dotDangKyHienTai,
    getPhieuDangKyModel,
    loading,
  } = useModel('daotao.dotdangkytinchi');

  useEffect(() => {
    if (recHocKy?.ma) getDotDangKy(recHocKy.ma).then(() => getPhieuDangKyModel(recHocKy.ma));
  }, [recHocKy?.ma]);

  return (
    <Row gutter={[18, 18]} style={{ marginBottom: 24 }}>
      <Col span={24}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <FilterHocKy isSetHocKy />

          <Popover content={<ViewDetailHocKy />} placement="right">
            <Button type="link">(chi tiết Học kỳ & Đợt đăng ký)</Button>
          </Popover>
        </div>
      </Col>

      <Col span={24}>
        <Spin spinning={loading}>
          {dotDangKyHienTai ? (
            <Steps
              progressDot
              className="step-dang-ky"
              current={moment().isSameOrBefore(dotDangKyHienTai.thoiGianKetThuc) ? 0 : 1}
            >
              <Steps.Step
                title={moment(dotDangKyHienTai.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
                subTitle="Thời gian bắt đầu đăng ký"
              />
              <Steps.Step
                title={moment(dotDangKyHienTai.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
                subTitle="Thời gian kết thúc đăng ký"
              />
            </Steps>
          ) : null}
        </Spin>
      </Col>
    </Row>
  );
};

export default FilterDotDangKy;
