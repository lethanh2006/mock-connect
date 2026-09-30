import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card } from 'antd';
import type { ReactNode } from 'react';
import { useIntl } from 'umi';
import './CardStyles.less';

const courseGradeColors: Partial<Record<ELoaiDiemChu, string>> = {
	[ELoaiDiemChu.A_PLUS]: '#16A34A',
	[ELoaiDiemChu.A]: '#16A34A',
	[ELoaiDiemChu.A_MINUS]: '#16A34A',
	[ELoaiDiemChu.B_PLUS]: 'var(--course-grade-neutral, #000000)',
	[ELoaiDiemChu.B]: 'var(--course-grade-neutral, #000000)',
	[ELoaiDiemChu.B_MINUS]: 'var(--course-grade-neutral, #000000)',
	[ELoaiDiemChu.C_PLUS]: 'var(--course-grade-neutral, #000000)',
	[ELoaiDiemChu.C]: 'var(--course-grade-neutral, #000000)',
	[ELoaiDiemChu.C_MINUS]: 'var(--course-grade-neutral, #000000)',
	[ELoaiDiemChu.D_PLUS]: '#FA580C',
	[ELoaiDiemChu.D]: '#FA580C',
	[ELoaiDiemChu.D_MINUS]: '#FA580C',
	[ELoaiDiemChu.F]: '#DC2626',
};

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
	const isNotStudied = trangThaiHoc === ETrangThaiHocTap.CHUA_HOC;
	const isCurrentlyStudying = trangThaiHoc === ETrangThaiHocTap.DANG_HOC;
	const diemHienThi = listDiem?.[0]?.diemChu;

	return (
		<div className='base-card base-card--course'>
			<Card hoverable onClick={onClick}>
				<div className='card-content'>
					<div className='card-main'>
						{label && <span className='card-label'>{label}</span>}
						<h4 className='card-title' title={[hocPhan?.ma, hocPhan?.ten].filter(Boolean).join(' - ')}>
							{hocPhan?.ten}
						</h4>
					</div>

					<div className='card-footer'>
						<span className='card-credits-text'>
							{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.courseCard.credits' })}
						</span>
						<div className='card-footer-right'>
							{isCurrentlyStudying && !diemHienThi && (
								<span className='card-registered-text'>{intl.formatMessage({ id: 'tientrinhhoctap.registered' })}</span>
							)}
							{diemHienThi && !isNotStudied && (
								<span
									className='card-grade-text'
									style={{ color: courseGradeColors[diemHienThi] ?? ColorDiemChu[diemHienThi] }}
								>
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
