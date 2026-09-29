import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { mapLoaiHocLuc, mapTrinhDoKqhtHocKy } from '@/services/HocTap/constant';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatKetQuaTichLuySinhVien = (props: {
	maKhoaNganh?: string;
	record?: KetQuaHocKy.IRecord;
	tongSoTinChiChuongTrinh?: number;
}) => {
	const intl = useIntl();
	const { maKhoaNganh, record: recordProp, tongSoTinChiChuongTrinh } = props;
	const { record: recordModel } = useModel('daotao.ketquahocky');
	const record = recordProp ?? recordModel;
	const { record: recTienTrinh, getTienTrinhTotNghiepModel } = useModel('sinhvien.tientrinhtotnghiep');

	useEffect(() => {
		if (!recordProp && maKhoaNganh && !recTienTrinh?.ctdtKeHoach?.tongSoTinChi) {
			getTienTrinhTotNghiepModel(maKhoaNganh);
		}
	}, [maKhoaNganh, recordProp]);

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
			valueColor: 'var(--color-primary)',
			backgroundColor: '#f3f7fb',
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
			valueColor: 'var(--color-primary)',
			backgroundColor: '#f3f7fb',
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.summary.classification' }),
			value: trinhDo,
			valueColor: 'var(--color-primary)',
			backgroundColor: '#f3f7fb',
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.summary.academicStanding' }),
			value: hocLuc,
			valueColor: 'var(--color-primary)',
			backgroundColor: '#f3f7fb',
		},
	];

	return (
		<StatisticsCard
			hideCard
			data={items}
			rowGutter={12}
			colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 6 }}
			autoBackground={{ enabled: false }}
			cardStyle={{ height: '100%', borderRadius: 10, alignItems: 'center' }}
		/>
	);
};

export default StatKetQuaTichLuySinhVien;
