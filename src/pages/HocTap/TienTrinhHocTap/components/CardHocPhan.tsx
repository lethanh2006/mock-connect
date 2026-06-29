import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { accentColors, tenTruongVietTatTiengAnh } from '@/services/base/constant';
import { Card } from 'antd';
// import { Card, Tag } from 'antd';
import type { ReactNode } from 'react';
import { useIntl } from 'umi';
import './CardStyles.less';

const CardHocPhan = (props: {
	hocPhan?: Partial<HocPhan.IRecord>;
	listDiem?: LopHocPhan.IDiemHpSvHk[];
	onClick: () => void;
	colorKhoiKienThuc?: string;
	trangThaiHoc?: ETrangThaiHocTap;
	label?: ReactNode;
}) => {
	const intl = useIntl();
	const { hocPhan, listDiem, trangThaiHoc, onClick, label } = props;
	const soTinChi = hocPhan?.soTinChi ?? 0;
	const listDiemChu = listDiem?.map((item) => item.diemChu || '');

	const isNotStudied = trangThaiHoc === ETrangThaiHocTap.CHUA_HOC;
	const isCurrentlyStudying = trangThaiHoc === ETrangThaiHocTap.DANG_HOC || undefined;
	const isVinUni = tenTruongVietTatTiengAnh === 'VINUNI';
	// Chỉ hiển thị điểm đầu tiên
	const diemHienThi = listDiemChu?.[0];

	return (
		<div className='base-card'>
			<Card hoverable onClick={onClick} style={{ backgroundColor: accentColors.accent800 ?? '#f8f8f8' }}>
				{/* Background Image - Dùng ảnh điểm làm background */}

				{/* Content */}
				<div className='card-content'>
					{/* Course name */}
					{label && <span className='card-label'>{label}</span>}

					{hocPhan?.ma && (
						<div className={`card-course-code ${isNotStudied ? 'not-studied' : 'default'}`}>{hocPhan.ma}</div>
					)}
					<h4 className={`card-title ${isNotStudied ? 'not-studied' : 'default'}`} title={hocPhan?.ten}>
						{hocPhan?.ten}
					</h4>

					{/* Credits & Grade */}
					<div className='card-footer'>
						<span className='card-credits-text'>
							{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tinchi' })}
						</span>
						<div className='card-footer-right'>
							{isCurrentlyStudying && !diemHienThi && (
								<span className='card-registered-text'>{intl.formatMessage({ id: 'tientrinhhoctap.registered' })}</span>
							)}
							{diemHienThi && !isNotStudied && (
								<span className='card-grade-text' style={{ color: ColorDiemChu[diemHienThi] }}>
									{diemHienThi}
								</span>
							)}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default CardHocPhan;
