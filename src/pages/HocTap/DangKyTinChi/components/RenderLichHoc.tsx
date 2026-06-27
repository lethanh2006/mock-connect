import ExpandText from '@/components/ExpandText';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatTimeRange } from '@/utils/formatDate';
import { useIntl } from 'umi';
import './style.less';

const RenderLichHoc = (props: { lopHocPhan: LopHocPhan.IRecord; showAll?: boolean }) => {
	const intl = useIntl();
	const { lopHocPhan } = props;

	const lopHocPhanList = [lopHocPhan, ...(lopHocPhan.children ?? [])];
	const maHoaLichHoc = lopHocPhanList.flatMap((val) =>
		!!val?.lopGhepTkb?.maHoaLichHoc?.length ? val.lopGhepTkb.maHoaLichHoc : val?.maHoaLichHoc || [],
	);

	if (!maHoaLichHoc?.length)
		return <i style={{ color: '#999' }}>{intl.formatMessage({ id: 'dangkytinchi.renderlichhoc.khongcothongtin' })}</i>;

	const getThuLabel = (thu: number) =>
		intl.formatMessage({ id: thu < 7 ? `dangkytinchi.thu.${thu + 1}` : 'dangkytinchi.thu.cn' });

	const maHoaLichs = maHoaLichHoc?.sort((a, b) => a.thu - b.thu);
	const content = maHoaLichs?.map((item, index) => {
		const thu = getThuLabel(item.thu);
		const tietKetThuc = item.tietBatDau + item.soTiet - 1;
		const thoigian = formatTimeRange(item.gioBatDau, item.gioKetThuc);
		const thoiGianHienThi =
			thoigian ||
			intl.formatMessage({ id: 'dangkytinchi.renderlichhoc.tiet' }, { batdau: item.tietBatDau, ketthuc: tietKetThuc });
		const tenNhanSu = ''; //item.nhanSu?.hoDem ? [item.nhanSu.hoDem, item.nhanSu.ten].join(' ') : item.tenNhanSu ?? '';
		const phongHoc = item.phongHoc
			? intl.formatMessage({ id: 'dangkytinchi.renderlichhoc.phong' }, { phong: item.phongHoc })
			: '';
		const lichHocHienThi = [thu, thoiGianHienThi, tenNhanSu, phongHoc].filter((j) => !!j).join(', ');
		return (
			// eslint-disable-next-line react/no-array-index-key
			<div key={index} className='lich-hoc'>
				- {lichHocHienThi}
			</div>
		);
	});

	return props.showAll ? <>{content}</> : <ExpandText>{content}</ExpandText>;
};

export default RenderLichHoc;
