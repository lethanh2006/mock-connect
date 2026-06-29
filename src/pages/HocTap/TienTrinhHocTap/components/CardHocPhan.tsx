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

	// Function to get grade image
	// const getGradeImage = (grade: string) => {
	// 	if (isNotStudied) return null;
	// 	return GRADE_IMAGES[grade as keyof typeof GRADE_IMAGES] || GRADE_IMAGES.DEFAULT;
	// };

	// const gradeImage = diemHienThi ? getGradeImage(diemHienThi) : null;

	return (
		<div className='base-card'>
			<Card hoverable onClick={onClick} style={{ backgroundColor: accentColors.accent800 ?? '#f8f8f8' }}>
				{/* Background Image - Dùng ảnh điểm làm background */}
				{/* {gradeImage && <div className='card-background-image' style={{ backgroundImage: `url(${gradeImage})` }} />} */}

				{/* Content */}
				<div className='card-content'>
					{/* Course name */}
					{label && <span className='card-label'>{label}</span>}
					{/* {label && (
						<span className='card-label' style={{ paddingRight: gradeImage ? 100 : 0 }}>
							{label}
						</span>
					)} */}
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
							{isCurrentlyStudying && !diemHienThi && isVinUni && (
								<span className='card-registered-text'>{intl.formatMessage({ id: 'tientrinhhoctap.registered' })}</span>
							)}
							{diemHienThi && !isNotStudied && (
								<span className='card-grade-text' style={{ color: ColorDiemChu[diemHienThi] }}>
									{diemHienThi}
								</span>
							)}
						</div>
					</div>
					{/* Credits & Status */}
					{/* <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
						<Tag className='credits-tag'>
							{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tinchi' })}
						</Tag>
						{isCurrentlyStudying && isVinUni && (
							<div className='studying-text'>
								{intl.formatMessage({ id: 'tientrinhhoctap.danghoc' })}
							</div>
						)}
					</div> */}
				</div>

				{/* Currently studying indicator (Non-VinUni) */}
				{isCurrentlyStudying && !isVinUni && (
					<div
						className='studying-indicator'
						title={intl.formatMessage({ id: 'tientrinhhoctap.danghoc' })}
						// style={{ backgroundColor: colorKhoiKienThuc }}
					/>
				)}
			</Card>
		</div>
	);
};

export default CardHocPhan;
