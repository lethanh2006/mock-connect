import ExpandText from '@/components/ExpandText';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Tooltip } from 'antd';
import './style.less';

const RenderLichHoc = (props: {
	lopHocPhan: LopHocPhan.IRecord;
	lichThucHanh?: LopHocPhan.IRecord[];
	showAll?: boolean;
}) => {
	const { lopHocPhan, lichThucHanh = [] } = props;

	const maHoaLichHoc = [lopHocPhan, ...lichThucHanh]?.flatMap((val) =>
		!!val?.lopGhepTkb?.maHoaLichHoc?.length ? val.lopGhepTkb.maHoaLichHoc : val?.maHoaLichHoc || [],
	);

	if (!maHoaLichHoc?.length) return <i style={{ color: '#999' }}>Không có thông tin lịch học</i>;

	const maHoaLichs = maHoaLichHoc?.sort((a, b) => a.thu - b.thu);
	const content = maHoaLichs?.map((item, index) => {
		const dsTuan = item.danhSachTuan.map((j) => j.tuan).sort((a, b) => a - b);
		const thu = item.thu < 7 ? `Thứ ${item.thu + 1}` : 'Chủ nhật';
		const tiet = `tiết ${item.tietBatDau}-${item.tietBatDau + item.soTiet - 1}`;
		const tenNhanSu = ''; //item.nhanSu?.hoDem ? [item.nhanSu.hoDem, item.nhanSu.ten].join(' ') : item.tenNhanSu ?? '';
		// <i style={{ color: '#999' }}>Không có thông tin g/v</i>;
		const phongHoc = item.phongHoc ? `phòng ${item.phongHoc}` : '';
		return (
			// eslint-disable-next-line react/no-array-index-key
			<div key={index} className='lich-hoc'>
				- {thu}, {tiet},{' '}
				{props.showAll ? (
					<>
						{dsTuan.length} tuần ({dsTuan.join(',')})
					</>
				) : (
					<Tooltip title={dsTuan.join(', ')}>
						<a>{dsTuan.length} tuần</a>
					</Tooltip>
				)}
				, {[tenNhanSu, phongHoc].filter((j) => !!j).join(', ')}
			</div>
		);
	});

	return props.showAll ? <>{content}</> : <ExpandText>{content}</ExpandText>;
};

export default RenderLichHoc;
