import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import classNames from 'classnames';

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

	return (
		<div className='col-hoc-phan'>
			<div
				className={classNames({
					'card-hoc-phan': true,
					'card-chua-hoc': trangThaiHoc === ETrangThaiHocTap.CHUA_HOC,
					'card-truot': listDiemChu?.length && listDiemChu.every((diem) => diem === ELoaiDiemChu.F),
				})}
				onClick={() => onClick()}
			>
				<h4>{hocPhan?.ten}</h4>
				<span className='tin-chi'>{soTinChi} tín chỉ</span>
				<div className='khoi-kien-thuc' style={{ borderLeftColor: colorKhoiKienThuc }} />
				{/* <img src='/images/img-card-hoc-phan.svg' /> */}
			</div>
			{listDiemChu?.map((diem, index) => (
				<div
					className={`bookmark bookmark-diem ${
						diem.includes('A') || diem.includes('B') || diem === ELoaiDiemChu.PASS
							? 'diem-green'
							: diem.includes('C') || diem.includes('D')
							? 'diem-yellow'
							: diem?.includes('F')
							? 'diem-red'
							: 'diem-gray'
					}`}
					style={{ right: 1 + index * 2.3 + 'rem' }}
					// eslint-disable-next-line react/no-array-index-key
					key={index}
				>
					{diem}
				</div>
			))}

			{trangThaiHoc === ETrangThaiHocTap.DANG_HOC ? (
				<div className='bookmark bookmark-dang-hoc' title='Đang học' />
			) : null}
		</div>
	);
};

export default CardHocPhan;
