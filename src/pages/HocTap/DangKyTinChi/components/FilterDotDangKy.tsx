import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import dayjs from '@/utils/dayjs';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FilterDotDangKy = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const {
		getDotDangKyAvailableModel: getDotDangKy,
		dotDangKyHienTai,
		sinhVienDot,
	} = useModel('daotao.dotdangkytinchi');
	// Đang trong thời gian đăng ký tín chỉ => Được phép đăng ký, xóa đăng ký
	const dangTrongThoiGian =
		dotDangKyHienTai?.thoiGianBatDau &&
		dotDangKyHienTai?.thoiGianKetThuc &&
		dayjs().isSameOrAfter(dayjs(dotDangKyHienTai?.thoiGianBatDau)) &&
		dayjs().isSameOrBefore(dayjs(dotDangKyHienTai?.thoiGianKetThuc));

	useEffect(() => {
		if (recHocKy?.ma) getDotDangKy(recHocKy.ma);
	}, [recHocKy?.ma]);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
					<FilterHocKy isSetHocKy />

					{/* <Popover content={<ViewDetailHocKy />} placement='right'>
						<Button type='link' icon={<InfoCircleOutlined />}>
							{intl.formatMessage({ id: 'dangkytinchi.filter.btn.xemchitiet' })}
						</Button>
					</Popover> */}

					{/* {dotDangKyHienTai && sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
						<span className={dangTrongThoiGian ? 'text-success' : 'text-error'}>
							{intl.formatMessage(
								{ id: 'dangkytinchi.filter.thoigiandangky.title' },
								{
									thoigianbatdau: formatDateTime(dotDangKyHienTai?.thoiGianBatDau),
									thoigianketthuc: formatDateTime(dotDangKyHienTai?.thoiGianKetThuc),
									span: (chunks) => <span className='fw500'>{chunks}</span>,
								},
							)}
						</span>
					) : null} */}
				</div>
			</Col>

			{/* <Col span={24}>
				<Spin spinning={loading}>
					{dotDangKyHienTai ? (
						<Steps
							progressDot
							className='step-dang-ky'
							current={moment().isSameOrBefore(dotDangKyHienTai.thoiGianKetThuc) ? 0 : 1}
						>
							<Steps.Step
								title={moment(dotDangKyHienTai.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
								subTitle='Thời gian bắt đầu đăng ký'
							/>
							<Steps.Step
								title={moment(dotDangKyHienTai.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
								subTitle='Thời gian kết thúc đăng ký'
							/>
						</Steps>
					) : null}
				</Spin>
			</Col> */}
		</Row>
	);
};

export default FilterDotDangKy;
