import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { mapLoaiHocLuc, mapTrinhDoKqhtHocKy } from '@/services/HocTap/constant';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { useResolvedTheme } from '@vinuni/ui';
import { theme, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatKetQuaTichLuySinhVien = (props: {
	maKhoaNganh?: string;
	record?: KetQuaHocKy.IRecord;
	tongSoTinChiChuongTrinh?: number;
}) => {
	const intl = useIntl();
	const { token } = theme.useToken();
	const valueColor = useResolvedTheme() === 'dark' ? 'var(--ds-brand-accent-blue-pale)' : 'var(--ds-function-link)';
	const { maKhoaNganh, tongSoTinChiChuongTrinh } = props;
	const { record: recordModel } = useModel('daotao.ketquahocky');
	const record = props.record ?? recordModel;
	const { record: recTienTrinh, getTienTrinhTotNghiepModel } = useModel('sinhvien.tientrinhtotnghiep');

	useEffect(() => {
		if (tongSoTinChiChuongTrinh === undefined && maKhoaNganh && !recTienTrinh?.ctdtKeHoach?.tongSoTinChi) {
			getTienTrinhTotNghiepModel(maKhoaNganh);
		}
	}, [maKhoaNganh, tongSoTinChiChuongTrinh]);

	if (!record?._id) return null;

	const tongTinChi = record.tongSoTinChiTichLuyToanKhoa ?? '--';
	const tongTinChiToanKhoa = tongSoTinChiChuongTrinh ?? recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? '--';
	const trinhDo =
		record.trinhDo && mapTrinhDoKqhtHocKy[record.trinhDo]
			? intl.formatMessage({ id: mapTrinhDoKqhtHocKy[record.trinhDo] })
			: (record.trinhDo ?? '--');
	const hocLuc =
		record.hocLuc && mapLoaiHocLuc[record.hocLuc]
			? intl.formatMessage({ id: mapLoaiHocLuc[record.hocLuc] })
			: (record.hocLuc ?? '--');

	const items: StatisticsItem[] = [
		{
			title: (
				<div>
					<Typography.Text strong>{intl.formatMessage({ id: 'ketquahoctap.summary.cumGpa' })}</Typography.Text>
					<Typography.Text type='secondary' style={{ display: 'block', fontSize: 12, marginTop: 2 }}>
						{intl.formatMessage({ id: 'ketquahoctap.summary.cumGpaScale' })}
					</Typography.Text>
				</div>
			),
			value: record.trungBinhTichLuyToanKhoaThang4 ?? '--',
			valueColor,
			backgroundColor: token.colorFillQuaternary,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.summary.totalCredits' }),
			value: (
				<span style={{ whiteSpace: 'nowrap' }}>
					{tongTinChi}
					<Typography.Text type='secondary' style={{ fontSize: 16, fontWeight: 400 }}>
						{' '}
						/{tongTinChiToanKhoa}
					</Typography.Text>
				</span>
			),
			valueColor,
			backgroundColor: token.colorFillQuaternary,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.summary.classification' }),
			value: <span className='academic-summary-text-value'>{trinhDo}</span>,
			valueColor,
			backgroundColor: token.colorFillQuaternary,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.summary.academicStanding' }),
			value: <span className='academic-summary-text-value'>{hocLuc}</span>,
			valueColor,
			backgroundColor: token.colorFillQuaternary,
		},
	];

	return (
		<StatisticsCard
			hideCard
			data={items}
			rowGutter={12}
			colSpan={{ xs: 24, sm: 12, xxl: 6 }}
			autoBackground={{ enabled: false }}
			statShadow={false}
			cardStyle={{ minHeight: 68, alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
		/>
	);
};

export default StatKetQuaTichLuySinhVien;
