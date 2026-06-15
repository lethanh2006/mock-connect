import ExpandText from '@/components/ExpandText';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Tooltip } from 'antd';
import { useIntl } from 'umi';
import './style.less';

const RenderLichHoc = (props: { lopHocPhan: LopHocPhan.IRecord; showAll?: boolean }) => {
	const intl = useIntl();
	const { lopHocPhan } = props;

	const maHoaLichHoc = [lopHocPhan, ...(lopHocPhan.children ?? [])]?.flatMap((val) =>
		!!val?.lopGhepTkb?.maHoaLichHoc?.length ? val.lopGhepTkb.maHoaLichHoc : val?.maHoaLichHoc || [],
	);

	if (!maHoaLichHoc?.length)
		return <i style={{ color: '#999' }}>{intl.formatMessage({ id: 'dangkytinchi.renderlichhoc.khongcothongtin' })}</i>;

	const getThuLabel = (thu: number) =>
		intl.formatMessage({ id: thu < 7 ? `dangkytinchi.thu.${thu + 1}` : 'dangkytinchi.thu.cn' });

	const maHoaLichs = maHoaLichHoc?.sort((a, b) => a.thu - b.thu);
	const content = maHoaLichs?.map((item, index) => {
		const dsTuan = item.danhSachTuan.map((j) => j.tuan).sort((a, b) => a - b);
		const thu = getThuLabel(item.thu);
		const tiet = intl.formatMessage(
			{ id: 'dangkytinchi.renderlichhoc.tiet' },
			{
				batdau: item.tietBatDau,
				ketthuc: item.tietBatDau + item.soTiet - 1,
			},
		);
		const tenNhanSu = ''; //item.nhanSu?.hoDem ? [item.nhanSu.hoDem, item.nhanSu.ten].join(' ') : item.tenNhanSu ?? '';
		const phongHoc = item.phongHoc
			? intl.formatMessage({ id: 'dangkytinchi.renderlichhoc.phong' }, { phong: item.phongHoc })
			: '';
		return (
			// eslint-disable-next-line react/no-array-index-key
			<div key={index} className='lich-hoc'>
				- {thu}, {tiet},{' '}
				{props.showAll ? (
					intl.formatMessage(
						{ id: 'dangkytinchi.renderlichhoc.tuanchitiet' },
						{ count: dsTuan.length, danhsach: dsTuan.join(',') },
					)
				) : (
					<Tooltip title={dsTuan.join(', ')}>
						<a>{intl.formatMessage({ id: 'dangkytinchi.renderlichhoc.tuan' }, { count: dsTuan.length })}</a>
					</Tooltip>
				)}
				, {[tenNhanSu, phongHoc].filter((j) => !!j).join(', ')}
			</div>
		);
	});

	return props.showAll ? <>{content}</> : <ExpandText>{content}</ExpandText>;
};

export default RenderLichHoc;
