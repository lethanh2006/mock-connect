import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Tag } from 'antd';

// Background image sẽ là ảnh điểm tương ứng
const CardHocPhan = (props: {
	hocPhan?: Partial<HocPhan.IRecord>;
	listDiem?: LopHocPhan.IDiemHpSvHk[];
	onClick: () => void;
	colorKhoiKienThuc?: string;
	trangThaiHoc?: ETrangThaiHocTap;
}) => {
	const { hocPhan, listDiem, colorKhoiKienThuc, trangThaiHoc, onClick } = props;
	const soTinChi = hocPhan?.soTinChi ?? 0;
	const listDiemChu = listDiem?.map((item) => item.diemChu || ELoaiDiemChu.CHUA_DU_DU_LIEU);

	// Chỉ hiển thị điểm đầu tiên
	const diemHienThi = listDiemChu?.[0];

	const MarkAPlus = '/images/mark-a-plus.png';
	const MarkA = '/images/mark-a.png';
	const MarkBPlus = '/images/mark-b-plus.png';
	const MarkB = '/images/mark-b.png';
	const MarkCPlus = '/images/mark-c-plus.png';
	const MarkC = '/images/mark-c.png';
	const MarkDPlus = '/images/mark-d-plus.png';
	const MarkD = '/images/mark-d.png';
	const MarkDefault = '/images/mark-default.png';
	const MarkF = '/images/mark-f.png';
	const MarkP = '/images/mark-p.png';

	// Function to get grade image
	const getGradeImage = (grade: string) => {
		switch (grade) {
			case 'A+':
				return MarkAPlus;
			case 'A':
				return MarkA;
			case 'B+':
				return MarkBPlus;
			case 'B':
				return MarkB;
			case 'C+':
				return MarkCPlus;
			case 'C':
				return MarkC;
			case 'D+':
				return MarkDPlus;
			case 'D':
				return MarkD;
			case 'F':
				return MarkF;
			case 'P':
				return MarkP;
			default:
				if (isNotStudied) {
					return null;
				}
				return MarkDefault;
		}
	};

	// Check if failed all subjects
	const isNotStudied = trangThaiHoc === ETrangThaiHocTap.CHUA_HOC;
	const isCurrentlyStudying = trangThaiHoc === ETrangThaiHocTap.DANG_HOC;

	return (
		<div style={{ position: 'relative', marginBottom: '4px' }}>
			<Card
				hoverable
				onClick={onClick}
				style={{
					borderRadius: '8px',
					position: 'relative',
					overflow: 'hidden',
					background: '#fff',
					minHeight: '120px',
					boxShadow: '0px 0px 12px 0px #0000000A',
					cursor: 'pointer',
				}}
				bodyStyle={{
					padding: '20px',
					position: 'relative',
					height: '100%',
				}}
				onMouseEnter={(e) => {
					const target = e.currentTarget as HTMLDivElement;
					target.style.transition = 'all 0.3s ease';
					target.style.transform = 'scale(1.005) translateY(-3px)';
				}}
				onMouseLeave={(e) => {
					const target = e.currentTarget as HTMLDivElement;
					target.style.transition = 'all 0.3s ease';
					target.style.transform = 'scale(1) translateY(0)';
				}}
			>
				{/* Background Image - Dùng ảnh điểm làm background */}
				{diemHienThi && getGradeImage(diemHienThi) && (
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							width: '60%',
							height: '60%',
							backgroundImage: `url(${getGradeImage(diemHienThi)})`,
							backgroundSize: 'contain',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'bottom right',
							zIndex: 1,
						}}
					/>
				)}

				{/* Content */}
				<div style={{ position: 'relative', zIndex: 2 }}>
					{/* Course name */}
					<h4
						style={{
							fontSize: '18px',
							fontWeight: '600',
							color: isNotStudied ? '#8c8c8c' : '#262626',
							marginBottom: '12px',
							marginTop: '0',
							paddingRight: '60px',
							lineHeight: '1.4',
						}}
						title={hocPhan?.ten}
					>
						{hocPhan?.ten}
					</h4>

					{/* Credits */}
					<Tag
						style={{
							background: '#fff2f0',
							color: '#ff4d4f',
							border: '1px solid #ffccc7',
							padding: '1px 6px',
							fontWeight: '500',
						}}
					>
						{soTinChi} tín chỉ
					</Tag>
				</div>

				{/* Currently studying indicator */}
				{isCurrentlyStudying && (
					<div
						style={{
							position: 'absolute',
							top: '-6px',
							right: '-6px',
							width: '12px',
							height: '12px',
							borderRadius: '50%',
							backgroundColor: '#52c41a',
							border: '2px solid #fff',
							zIndex: 10,
						}}
						title='Đang học/Chưa có KQHT'
					/>
				)}
			</Card>
		</div>
	);
};

export default CardHocPhan;
