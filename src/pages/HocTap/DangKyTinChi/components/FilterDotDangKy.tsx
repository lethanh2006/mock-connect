import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ViewDetailHocKy from './ViewDetailHocKy';

const FilterDotDangKy = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { getDotDangKyAvailableModel: getDotDangKy, dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	useEffect(() => {
		if (recHocKy?.ma) getDotDangKy(recHocKy.ma);
	}, [recHocKy?.ma]);

	return (
		<Row gutter={[18, 18]} style={{ marginBottom: 24 }}>
			<Col span={24}>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
					<FilterHocKy isSetHocKy />

					<Popover content={<ViewDetailHocKy />} placement='right'>
						<Button type='link' icon={<InfoCircleOutlined />}>
							Xem chi tiết
						</Button>
					</Popover>

					{dotDangKyHienTai ? (
						<span>
							Thời gian đăng ký từ{' '}
							<span className='fw500'>{moment(dotDangKyHienTai.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</span> đến{' '}
							<span className='fw500'>{moment(dotDangKyHienTai.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</span>
						</span>
					) : null}
				</div>
			</Col>

			{/* <Col span={24}>
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
      </Col> */}
		</Row>
	);
};

export default FilterDotDangKy;
