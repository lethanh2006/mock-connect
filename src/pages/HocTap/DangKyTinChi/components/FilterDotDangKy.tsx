import { Col, Row } from '@/components/MyGrid';
import VinSelect from '@/components/VinSelect';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { useEffect } from 'react';
import { useModel } from 'umi';
import type { TDangKyTinChiPreviewData } from '../localPreviewData';

const FilterDotDangKy = ({ previewData }: { previewData?: TDangKyTinChiPreviewData }) => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { getDotDangKyAvailableModel: getDotDangKy } = useModel('daotao.dotdangkytinchi');

	useEffect(() => {
		if (!previewData && recHocKy?.ma) getDotDangKy(recHocKy.ma);
	}, [previewData, recHocKy?.ma]);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
					{previewData ? (
						<VinSelect
							style={{ width: 'clamp(150px, 40vw, 250px)' }}
							value={previewData.hocKy.ma}
							options={[{ value: previewData.hocKy.ma, label: previewData.hocKy.ten }]}
						/>
					) : (
						<FilterHocKy isSetHocKy />
					)}

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
