import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Tag } from 'antd';
import { useIntl } from 'umi';
import './CardStyles.less';

// Grade images mapping
const GRADE_IMAGES = {
	'A+': '/images/mark-a-plus.svg',
	A: '/images/mark-a.svg',
	'A-': '/images/mark-a-minus.svg',
	'B+': '/images/mark-b-plus.svg',
	B: '/images/mark-b.svg',
	'B-': '/images/mark-b-minus.svg',
	'C+': '/images/mark-c-plus.svg',
	C: '/images/mark-c.svg',
	'C-': '/images/mark-c-minus.svg',
	'D+': '/images/mark-d-plus.svg',
	D: '/images/mark-d.svg',
	'D-': '/images/mark-d-minus.svg',
	F: '/images/mark-f.svg',
	P: '/images/mark-p.svg',
	CR: '/images/mark-cr.svg',
	NCR: '/images/mark-ncr.svg',
	NGR: '/images/mark-ngr.svg',
	S: '/images/mark-s.svg',
	U: '/images/mark-u.svg',
	W: '/images/mark-w.svg',
	IP: '/images/mark-ip.svg',
	DEFAULT: '/images/mark-default.svg',
} as const;

const CardHocPhan = (props: {
	hocPhan?: Partial<HocPhan.IRecord>;
	listDiem?: LopHocPhan.IDiemHpSvHk[];
	onClick: () => void;
	colorKhoiKienThuc?: string;
	trangThaiHoc?: ETrangThaiHocTap;
}) => {
	const intl = useIntl();
	const { hocPhan, listDiem, colorKhoiKienThuc, trangThaiHoc, onClick } = props;
	const soTinChi = hocPhan?.soTinChi ?? 0;
	const listDiemChu = listDiem?.map((item) => item.diemChu || ELoaiDiemChu.CHUA_DU_DU_LIEU);

	// Chỉ hiển thị điểm đầu tiên
	const diemHienThi = listDiemChu?.[0];

	// Function to get grade image
	const getGradeImage = (grade: string) => {
		if (isNotStudied) return null;
		return GRADE_IMAGES[grade as keyof typeof GRADE_IMAGES] || GRADE_IMAGES.DEFAULT;
	};

	// Check status
	const isNotStudied = trangThaiHoc === ETrangThaiHocTap.CHUA_HOC;
	const isCurrentlyStudying = trangThaiHoc === ETrangThaiHocTap.DANG_HOC;

	const gradeImage = diemHienThi ? getGradeImage(diemHienThi) : null;

	return (
		<div className='base-card'>
			<Card hoverable onClick={onClick}>
				{/* Background Image - Dùng ảnh điểm làm background */}
				{gradeImage && <div className='card-background-image' style={{ backgroundImage: `url(${gradeImage})` }} />}

				{/* Content */}
				<div className='card-content'>
					{/* Course name */}
					<h4 className={`card-title ${isNotStudied ? 'not-studied' : 'default'}`} title={hocPhan?.ten}>
						{hocPhan?.ten}
					</h4>

					{/* Credits */}
					<Tag className='credits-tag'>
						{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tinchi' })}
					</Tag>
				</div>

				{/* Currently studying indicator */}
				{isCurrentlyStudying && (
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
