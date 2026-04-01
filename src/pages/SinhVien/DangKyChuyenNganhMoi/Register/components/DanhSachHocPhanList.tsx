import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import type { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { Button, Card, Popconfirm, Space, Spin, Tag, Typography } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';

type Row = ChuongTrinhDaoTao.IKhoiHpCt;

interface DanhSachHocPhanListProps {
	choosenMinor: string;
	choosenMinorName?: string;
	onSuccess?: () => void;
	isMinor: boolean;
	hiddenButton?: boolean;
}

const DanhSachHocPhanList = ({
	choosenMinor,
	choosenMinorName,
	onSuccess,
	isMinor,
	hiddenButton,
}: DanhSachHocPhanListProps) => {
	const intl = useIntl();
	const {
		submitPhieuDangKy,
		formSubmiting: loadingSubmit,
		record: phieuDangKyHienTai,
	} = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');
	const { danhSach, loading } = useModel('daotao.khoihpctnganh');
	const [visibleDeCuong, setVisibleDeCuong] = useState(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);
	const [selectedElectiveRows, setSelectedElectiveRows] = useState<ChuongTrinhDaoTao.IKhoiHpCt[]>([]);
	const minor = danhSach.find((item) => item.maChuyenNganh === choosenMinor);
	const effectiveKhoiHpCtList = useMemo(() => minor?.hocPhanCtdtList ?? [], [minor?.hocPhanCtdtList]);
	const { compulsory, electiveGroups } = useMemo((): {
		compulsory: ChuongTrinhDaoTao.IKhoiHpCt[];
		electiveGroups: ChuongTrinhDaoTao.IKhoiHpCt[];
	} => {
		const raw = [...danhSach].sort((a, b) => (a.soThuTuKy ?? 0) - (b.soThuTuKy ?? 0));
		console.log(raw, 'rawrawraw');
		const compRaw: Row[] = [];
		const electiveGroupsList: ChuongTrinhDaoTao.IKhoiHpCt[] = [];

		for (const it of raw) {
			const loaiHocPhanCtdt = it.loaiHocPhanCtdt;
			const isBatBuoc = loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC;
			const isTuChon = loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON;

			if (isBatBuoc) {
				compRaw.push(it);
			} else if (isTuChon) {
				if (!it.hocPhanCtdtList?.length) continue;
				electiveGroupsList.push({ ...it, hocPhanCtdtList: [...it.hocPhanCtdtList] });
			}
		}

		const compulsoryMap = new Map<string, Row>();
		for (const it of compRaw) {
			const key = it.hocPhan?.ma ?? it.maHocPhan ?? it._id;
			const existed = compulsoryMap.get(key);
			if (!existed) {
				compulsoryMap.set(key, it);
				continue;
			}

			compulsoryMap.set(key, {
				...existed,
				...it,
				hocPhan: it.hocPhan ?? existed.hocPhan,
				maHocPhan: it.maHocPhan ?? existed.maHocPhan,
				ten: it.hocPhan?.ten ?? existed.hocPhan?.ten,
				soThuTuKy: Math.min(existed.soThuTuKy ?? 0, it.soThuTuKy ?? 0),
				dsHocPhanTienQuyet: it?.dsHocPhanTienQuyet ?? [],
			});
		}

		const compulsory = [...compulsoryMap.values()].sort((a, b) => (a.soThuTuKy ?? 0) - (b.soThuTuKy ?? 0));
		return { compulsory, electiveGroups: electiveGroupsList };
	}, [effectiveKhoiHpCtList]);

	const isGroupRow = (r: Row) => (r._id ?? '').toString().startsWith('-0-');
	const isCompulsory = (r: Row) => (r._id ?? '').toString().startsWith('-1-');
	const ELECTIVE_COLUMN_COUNT = 6;

	const dataAll = useMemo((): Row[] => {
		const list: Row[] = [];
		let stt = 0;
		if (compulsory.length > 0) {
			list.push({
				_id: '-0-0',
				ma: '',
				maHocPhan: '',
				maChuongTrinhDaoTao: '',
				ten: intl.formatMessage({ id: 'minor.course.compulsory' }),
			});
			compulsory.forEach((row, idx) => {
				stt += 1;
				list.push({ ...row, _id: `-1-${idx}`, __stt: stt } as Row & { __stt?: number });
			});
		}
		for (let i = 0; i < electiveGroups.length; i++) {
			const group = electiveGroups[i];
			const soHocPhan = group.soHocPhanTuChonPhaiHoc;
			let ten = group.ten ?? '';
			if (soHocPhan != null && soHocPhan > 0) {
				ten = `${group.ten ?? ''} (${intl.formatMessage({ id: 'minor.course.electiveRequired' }, { count: soHocPhan })})`;
			}
			list.push({ _id: `-0-${i + 1}`, ma: '', maHocPhan: '', maChuongTrinhDaoTao: '', ten });
			const hocPhanList = group.hocPhanCtdtList ?? [];
			hocPhanList.forEach((row) => {
				stt += 1;
				list.push({ ...row, __stt: stt } as Row & { __stt?: number });
			});
		}
		return list;
	}, [compulsory, electiveGroups, intl]);

	const rowSelection: TableRowSelection<Row> | undefined =
		hiddenButton || !isMinor
			? undefined
			: {
					type: 'checkbox',
					selectedRowKeys: selectedElectiveRows.map((row) => row._id ?? row.maHocPhan ?? ''),
					preserveSelectedRowKeys: true,
					onChange: (_: React.Key[], rows: Row[]) =>
						setSelectedElectiveRows(rows.filter((r) => !isGroupRow(r) && !isCompulsory(r))),
					columnWidth: 48,
					hideSelectAll: true,
					renderCell: (checked, record, _index, originNode) =>
						isGroupRow(record) || isCompulsory(record) ? null : originNode,
				};

	const handleXemDeCuong = (record: Row) => {
		setDeCuongModal({
			deCuongId: record.hocPhan?.ma ?? '',
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${record.hocPhan?.ten || record.maHocPhan || ''}`,
		});
		setVisibleDeCuong(true);
	};

	const onCell = (rec: Row) => ({
		onClick: () => rec._id && handleXemDeCuong(rec),
		style: { cursor: 'pointer', color: (rec as any).skip ? '#bbb' : undefined },
	});

	const columns: IColumn<Row>[] = [
		{
			title: intl.formatMessage({ id: 'minor.course.code' }),
			width: 140,
			dataIndex: 'maHocPhan',
			render: (_, rec) => {
				const code = rec.hocPhan?.ma ?? rec.maHocPhan ?? '-';
				return (
					<a
						onClick={(e) => {
							e.stopPropagation();
							handleXemDeCuong(rec);
						}}
					>
						{code}
					</a>
				);
			},
			onCell,
			key: 'maHocPhan',
		},
		{
			title: intl.formatMessage({ id: 'minor.course.name' }),
			width: 180,
			dataIndex: 'hocPhan',
			render: (_, rec) => rec.hocPhan?.ten ?? '-',
			onCell,
			key: 'tenHocPhan',
		},
		{
			title: intl.formatMessage({ id: 'minor.table.sem' }),
			width: 100,
			align: 'center',
			dataIndex: 'soThuTuKy',
			render: (_, rec) => intl.formatMessage({ id: 'minor.table.semFormat' }, { sem: rec.soThuTuKy }),
			onCell,
			key: 'soThuTuKy',
		},
		{
			title: intl.formatMessage({ id: 'minor.course.creditsCount' }),
			width: 100,
			align: 'center',
			dataIndex: 'hocPhan',
			render: (_, rec) => {
				const credits = rec.hocPhan?.soTinChi || 0;
				const tagColor = credits === 0 ? 'default' : credits === 1 || credits === 2 ? 'gold' : 'red';
				return (
					<Tag color={tagColor}>
						{credits} {intl.formatMessage({ id: 'minor.table.credits' })}
					</Tag>
				);
			},
			onCell,
			key: 'soTinChi',
		},
		{
			title: intl.formatMessage({ id: 'minor.course.prerequisiteList' }),
			dataIndex: 'dsHocPhanTienQuyet',
			width: 200,
			render: (val: any) =>
				Array.isArray(val)
					? val
							.map((item: any) => item?.ma)
							.filter(Boolean)
							.join(', ')
					: '',
			onCell,
			key: 'dsHocPhanTienQuyet',
		},
	];


	const columnsAll: IColumn<Row>[] = [
		{
			title: intl.formatMessage({ id: 'global.table.column.tt' }),
			width: 60,
			render: (_, rec: Row, index: number) => (isGroupRow(rec) ? rec.ten : index),
			onCell: (rec: Row) => (isGroupRow(rec) ? { colSpan: ELECTIVE_COLUMN_COUNT } : {}),
		},
		...columns.map((col) => ({
			...col,
			onCell: (rec: Row) => (isGroupRow(rec) ? { colSpan: 0 } : (col.onCell?.(rec) ?? {})),
		})),
	];

	return (
		<>
			<Card
				title={`${intl.formatMessage({ id: 'minor.breadcrumb.detail' })} ${choosenMinorName || ''}`}
				loading={false}
			>
				{loading ? (
					<div style={{ textAlign: 'center', padding: '24px' }}>
						<Spin />
					</div>
				) : (
					<>
						{minor?.ghiChu && (
							<Space direction='vertical' style={{ marginBottom: '16px', display: 'flex' }}>
								<Typography.Text strong>{intl.formatMessage({ id: 'minor.objective.label' })}:</Typography.Text>
								<ExpandText ellipsis={{ rows: 2 }}>{String(minor?.ghiChu ?? '').trim()}</ExpandText>
							</Space>
						)}

						<TableStaticData
							data={dataAll}
							addStt={false}
							columns={columnsAll}
							otherProps={{
								pagination: false,
								scroll: { y: 450 },
								rowKey: (r: Row) => r._id ?? r.maHocPhan ?? '',
								rowSelection,
								onRow: (r: Row) => (isGroupRow(r) ? { style: { background: 'var(--color-info-bg)' } } : {}),
							}}
						/>
					</>
				)}

				{minor?.ma && !hiddenButton && (
					<div className='form-footer'>
						<Popconfirm
							title={intl.formatMessage({ id: 'minor.popconfirm.title' })}
							okText={intl.formatMessage({ id: 'minor.popconfirm.ok' })}
							cancelText={intl.formatMessage({ id: 'minor.popconfirm.cancel' })}
							onConfirm={async () => {
								try {
									const base: Partial<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto> = isMinor
										? { maCtdt: choosenMinor, loai: ELoaiPhieuDkCtdt.DEFAULT }
										: { maChuyenNganh: choosenMinor, loai: ELoaiPhieuDkCtdt.DEFAULT };
									await submitPhieuDangKy(
										phieuDangKyHienTai?._id ?? '',
										{
											...base,
											hpTuChonList: selectedElectiveRows?.map((row) => ({
												hocPhanCtdtId: row._id,
												maHocPhan: row.hocPhan?.ma,
												tenHocPhan: row.hocPhan?.ten,
												soTinChi: row.hocPhan?.soTinChi,
											})),
										},
										onSuccess,
									);
								} catch {}
							}}
						>
							<Button type='primary' loading={loadingSubmit} disabled={loading || !choosenMinor}>
								{isMinor
									? intl.formatMessage({ id: 'minor.button.registerMinor' })
									: intl.formatMessage({ id: 'minor.button.registerConcentration' })}
							</Button>
						</Popconfirm>
					</div>
				)}
			</Card>
			{deCuongModal && (
				<ModalHocPhan
					visible={visibleDeCuong}
					setVisible={setVisibleDeCuong}
					deCuongId={deCuongModal.deCuongId}
					title={deCuongModal.title}
				/>
			)}
		</>
	);
};

export default DanhSachHocPhanList;
