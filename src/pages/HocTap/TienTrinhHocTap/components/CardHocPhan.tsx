import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import classNames from 'classnames';
import { useState } from 'react';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';

const CardHocPhan = (props: {
	chuongTrinhKhung?: ChuongTrinhDaoTao.IHocPhanBase;
	khoiHocPhanCt?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
	sinhVienLopHocPhan?: LopHocPhan.IRecordSinhVienLopHP;
	isChuyenNganh?: boolean;
	colorKhoiKienThuc?: string;
}) => {
	const { chuongTrinhKhung, sinhVienLopHocPhan, khoiHocPhanCt, colorKhoiKienThuc } = props;
	const [modalVisible, setModalVisible] = useState(false);
	const listDiem = chuongTrinhKhung?.lichSuDiem?.map((diem) => diem.diemChu || ELoaiDiemChu.CHUA_DU_DU_LIEU) ?? [
		sinhVienLopHocPhan?.diemHpSvHk?.diemChu || ELoaiDiemChu.CHUA_DU_DU_LIEU,
	];
	const hocPhan = chuongTrinhKhung?.hocPhan ?? sinhVienLopHocPhan?.hocPhan;
	const soTinChi = hocPhan?.soTinChi ?? 0;

	return (
		<div className='col-hoc-phan'>
			<div
				className={classNames({
					'card-hoc-phan': true,
					'card-chua-hoc': chuongTrinhKhung?.hoc === ETrangThaiHocTap.CHUA_HOC,
					'card-truot': listDiem.length && listDiem.every((diem) => diem === ELoaiDiemChu.F),
				})}
				onClick={() => setModalVisible(true)}
			>
				<h4>{hocPhan?.ten}</h4>
				<span className='tin-chi'>{soTinChi} tín chỉ</span>
				<div className='khoi-kien-thuc' style={{ borderLeftColor: colorKhoiKienThuc }} />
				{/* <img src='/images/img-card-hoc-phan.svg' /> */}
			</div>
			{listDiem?.map((diem, index) => (
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

			{chuongTrinhKhung?.hoc === ETrangThaiHocTap.DANG_HOC ? (
				<div className='bookmark bookmark-dang-hoc' title='Đang học' />
			) : null}

			<ModalChiTietDiem
				setVisible={setModalVisible}
				visible={modalVisible}
				hocPhan={hocPhan}
				listDiem={
					chuongTrinhKhung?.lichSuDiem ?? (sinhVienLopHocPhan?.diemHpSvHk ? [sinhVienLopHocPhan.diemHpSvHk] : [])
				}
				lopHocPhanId={sinhVienLopHocPhan?.lopHocPhanId}
				trangThaiHoc={chuongTrinhKhung?.hoc}
				chuongTrinh={chuongTrinhKhung}
				khoiHocPhanCt={khoiHocPhanCt}
			/>
		</div>
	);
};

export default CardHocPhan;
