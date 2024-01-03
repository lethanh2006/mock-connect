import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { useModel } from 'umi';

const RenderLichHoc = (props: { lopHocPhan: LopHocPhan.IRecord }) => {
	const { danhSach: danhSachLopHc } = useModel('daotao.lophanhchinh');
	const { lopHocPhan } = props;
	const maLopHcList = lopHocPhan.lopHpHcList?.map((item) => item.maLopHc);
	const danhSachDoiTuongLopHc = danhSachLopHc.map((item) => item.doiTuong);
	const trungLopHc = danhSachDoiTuongLopHc.includes(lopHocPhan.doiTuongLopHanhChinh);

	const renderLich = () => {
		const maHoaLichs = lopHocPhan.maHoaLichHoc?.sort((a, b) => a.thu - b.thu);

		return maHoaLichs?.map((item, index) => {
			const dsTuan = item.danhSachTuan.map((j) => j.tuan).sort((a, b) => a - b);
			const thu = item.thu < 7 ? `Thứ ${item.thu + 1}` : 'Chủ nhật';
			const tiet = `tiết ${item.tietBatDau}-${item.tietBatDau + item.soTiet - 1}`;
			const tuan = `${dsTuan.length} tuần (${dsTuan.join(',')})`;
			return (
				// eslint-disable-next-line react/no-array-index-key
				<li key={index}>
					{[thu, tiet, tuan].join(', ')},{' '}
					{item.nhanSuSsoId ? (
						item.nhanSu?.hoDem ? (
							[item.nhanSu.hoDem, item.nhanSu.ten].join(' ')
						) : (
							<i style={{ color: '#999' }}>Không lấy được thông tin g/v</i>
						)
					) : (
						item.tenNhanSu ?? <i style={{ color: '#999' }}>Không có thông tin g/v</i>
					)}
					, phòng {item.phongHoc ?? ''}
				</li>
			);
		});
	};

	return (
		<ul className='lich-hoc'>
			{!lopHocPhan.maHoaLichHoc?.length ? (
				<li>
					<i style={{ color: '#999' }}>Không có thông tin lịch học</i>
				</li>
			) : (
				renderLich()
			)}

			{maLopHcList?.length ? (
				<li>
					Lớp gợi ý: <span className={trungLopHc ? undefined : 'text-error'}>{maLopHcList.join(', ')}</span>
				</li>
			) : null}
		</ul>
	);
};

export default RenderLichHoc;
