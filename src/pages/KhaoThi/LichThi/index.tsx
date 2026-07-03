import PageCard from '@/components/PageCard';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import {
	EDKDTCongNo,
	EDKDTKetQuaHocTap,
	ETrangThaiThi,
	colorDKDTCongNo,
	colorDKDTKetQuaHocTap,
	colorTrangThaiThi,
} from '@/services/KhaoThi/constant';
import dayjs from '@/utils/dayjs';
import { TeamOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import DanhSachSinhVienThi from './DanhSachSinhVienThi';

const getNgayThiTimestamp = (value?: string) => {
	if (!value) return Number.NEGATIVE_INFINITY;

	const ngayThi = dayjs(value, ['DD/MM/YYYY', 'D/M/YYYY'], true);
	const timestamp = ngayThi.isValid() ? ngayThi.valueOf() : dayjs(value).valueOf();

	return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

const LichThiPage = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSachMe, getMeByHocKyModel, loading } = useModel('khaothi.lichthi');
	const [recLichThi, setRecLichThi] = useState<LichThi.IRecordMe>();
	const [visibleDSSV, setVisibleDSSV] = useState<boolean>(false);
	const danhSachLichThi = useMemo(() => {
		const homNay = dayjs().startOf('day').valueOf();

		return _.sortBy(
			danhSachMe,
			(record) => Math.abs(getNgayThiTimestamp(record.ngayThi) - homNay),
			(record) => (getNgayThiTimestamp(record.ngayThi) >= homNay ? 0 : 1),
		);
	}, [danhSachMe]);

	const getData = () => {
		if (recHocKy?.ma) getMeByHocKyModel({ maHocKy: recHocKy.ma });
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const onCell = (rec: LichThi.IRecordMe) => ({
		onClick: () => {
			setRecLichThi(rec);
			setVisibleDSSV(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LichThi.IRecordMe>[] = [
		{
			title: intl.formatMessage({ id: 'lichthi.table.ngayThi' }),
			dataIndex: 'ngayThi',
			align: 'center',
			width: 80,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.gioThi' }),
			dataIndex: 'gioThi',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.maHP' }),
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.tenHocPhan' }),
			dataIndex: 'tenHocPhan',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.hinhThucThi' }),
			dataIndex: 'hinhThucThi',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.phongThi' }),
			dataIndex: 'phong',
			width: 80,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.soSV' }),
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.dieuKienDuThi' }),
			width: 160,

			children: [
				{
					title: intl.formatMessage({ id: 'lichthi.table.kqht' }),
					dataIndex: 'dieuKienKetQuaHocTap',
					align: 'center',
					width: 120,
					filterType: 'select',
					filterData: Object.values(EDKDTKetQuaHocTap),
					render: (val: EDKDTKetQuaHocTap) => val && <Tag color={colorDKDTKetQuaHocTap[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lichthi.table.congNo' }),
					dataIndex: 'dieuKienCongNo',
					align: 'center',
					width: 120,
					filterType: 'select',
					filterData: Object.values(EDKDTCongNo),
					render: (val: EDKDTCongNo) => val && <Tag color={colorDKDTCongNo[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lichthi.table.trangThaiThi' }),
					dataIndex: 'trangThai',
					align: 'center',
					width: 120,
					filterType: 'select',
					filterData: Object.values(ETrangThaiThi),
					render: (val: ETrangThaiThi) => val && <Tag color={colorTrangThaiThi[val]}>{val}</Tag>,
					onCell,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.dotThi' }),
			dataIndex: 'kyThi',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lichthi.table.thaoTac' }),
			align: 'center',
			width: 120,
			render: (rec) => (
				<Tooltip title={intl.formatMessage({ id: 'lichthi.tooltip.xemDSSV' })}>
					<Button
						type='link'
						onClick={() => {
							setRecLichThi(rec);
							setVisibleDSSV(true);
						}}
						icon={<TeamOutlined />}
					/>
				</Tooltip>
			),
		},
	];

	return (
		<PageCard
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>{intl.formatMessage({ id: 'lichthi.title' })}</span>
					<FilterHocKy isSetHocKy />
				</Space>
			}
		>
			<Card variant='borderless'>
				<TableStaticData
					columns={columns}
					data={danhSachLichThi}
					addStt
					loading={loading}
					onReload={getData}
					hasTotal
				/>

				{recLichThi && (
					<DanhSachSinhVienThi
						recLichThi={recLichThi}
						visible={visibleDSSV}
						handleCancel={() => setVisibleDSSV(false)}
					/>
				)}
			</Card>
		</PageCard>
	);
};

export default LichThiPage;
