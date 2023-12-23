import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';

const RenderLichHoc = (props: { lopHocPhan: LopHocPhan.IRecord }) => {
	const { lopHocPhan } = props;

	if (!lopHocPhan.maHoaLichHoc?.length) return <i style={{ color: '#999' }}>Không có thông tin lịch học</i>;

	const maHoaLichs = lopHocPhan.maHoaLichHoc?.sort((a, b) => a.thu - b.thu);
	return (
		<ul className='lich-hoc'>
			{maHoaLichs?.map((item, index) => {
				const dsTuan = item.danhSachTuan.map((j) => j.tuan).sort((a, b) => a - b);
				return (
					// eslint-disable-next-line react/no-array-index-key
					<li key={index}>
						{item.thu < 7 ? `Thứ ${item.thu + 1}` : 'Chủ nhật'}, tiết {item.tietBatDau}-
						{item.tietBatDau + item.soTiet - 1}, {dsTuan.length} tuần ({dsTuan.join(',')}),{' '}
						{item.nhanSuSsoId ? (
							item.nhanSu?.hoDem ? (
								[item.nhanSu.hoDem, item.nhanSu.ten].join(' ')
							) : (
								<i style={{ color: '#999' }}>Không lấy được thông tin g/v</i>
							)
						) : (
							item.tenNhanSu ?? <i style={{ color: '#999' }}>Không có thông tin g/v</i>
						)}
					</li>
				);
			})}
		</ul>
	);
};

export default RenderLichHoc;
