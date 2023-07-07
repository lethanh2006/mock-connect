import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { Col, Empty, Row, Steps, Spin } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './style.less';

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
          ) : (
            <Empty description="Không có đợt đăng ký tín chỉ trong học kỳ này !" />
          )}
        </Spin>
      </Col>
    </Row>
  );
};

export default FilterDotDangKy;
