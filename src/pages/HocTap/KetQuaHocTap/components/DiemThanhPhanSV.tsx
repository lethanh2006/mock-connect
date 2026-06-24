import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { CheckOutlined } from '@ant-design/icons';
import { Select, Space, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChiTietDiem from './ModalChiTietDiem';

interface DataType extends LopHocPhan.IDiemHpSvHk {
	title?: string;
	tenHocPhan?: string;
	hocKyTen?: string;
	maHocPhanQuyDoi?: string;
	isSemesterHeader?: boolean;
	tichLuy?: boolean;
	trongChuongTrinh?: boolean;
}

const isSemesterRow = (rec: DataType) => rec.isSemesterHeader === true;

const filterBySemester = (rows: DataType[], maHocKy: string) => {
	if (maHocKy === 'all') return rows;

	return rows.filter((row) => row.maHocKy === maHocKy);
};

const DiemThanhPhanSV = (props: { maKhoaNganh?: string }) => {
	const intl = useIntl();
	const { maKhoaNganh } = props;
	const { getKetQuaHocKy } = useModel('daotao.ketquahocky');
	const { getDiemSvHk, loading } = useModel('daotao.diemhpsvhk');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotao.daudiemhocphan');
	const [maHocKyFilter, setMaHocKyFilter] = useState<string>('all');
	const [data, setData] = useState<DataType[]>([]);
	const [diemSvList, setDiemSvList] = useState<LopHocPhan.IDiemHpSvHk[]>([]);
	const [visibleDiem, setVisibleDiem] = useState(false);
	const [recDiem, setRecDiem] = useState<DataType | null>(null);

	const buildSemesterTitle = useCallback(
		(
			mahk: string,
			hocKyTen: string | undefined,
			kqhk?: {
				trungBinhTichLuyToanKhoaThang4?: number | null;
				tongSoTinChiHocKy?: number | null;
				tongSoTinChiTichLuyToanKhoa?: number | null;
			},
			earnedCredits?: number,
		) => {
			let title = hocKyTen ?? intl.formatMessage({ id: 'ketquahoctap.diemtp.semester.default' }, { maHocKy: mahk });
			if (kqhk) {
				title += intl.formatMessage(
					{ id: 'ketquahoctap.diemtp.semester.summary' },
					{
						gpa: kqhk.trungBinhTichLuyToanKhoaThang4 ?? '--',
						earned: earnedCredits ?? kqhk.tongSoTinChiHocKy ?? '--',
						cumulative: kqhk.tongSoTinChiTichLuyToanKhoa ?? '--',
					},
				);
			}
			return title;
		},
		[intl],
	);

	const getData = useCallback(() => {
		if (!maKhoaNganh) return;

		Promise.all([getKetQuaHocKy(maKhoaNganh), getDiemSvHk(maKhoaNganh)]).then(([kqhkList, diemSv]) => {
			const res: DataType[] = [];
			const gHocKy = _.groupBy(diemSv, (item) => item.maHocKy); // Nhóm theo học kỳ
			const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp giảm dần học kỳ
			aHocKy.forEach(([mahk, diemHpHkList]) => {
				const kqhk = kqhkList.find((j) => j.maHocKy === mahk);
				const hocKyTen = diemHpHkList[0]?.hocKy?.ten;
				const diemHpHkData = diemHpHkList.map((diem, index) => ({
					...diem,
					title: `${index + 1}`,
					tenHocPhan: diem.hocPhan?.ten,
					maHocPhanQuyDoi:
						diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi !== diem.maHocPhan
							? diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi
							: '',
					trongChuongTrinh: diem.infoKhoaNganh?.[maKhoaNganh]?.trongCtdt ?? false,
				}));
				const earnedCredits = _.sumBy(diemHpHkData, (diem) =>
					diem.dat === true && diem.trongChuongTrinh === true ? (diem.hocPhan?.soTinChi ?? 0) : 0,
				);
				const tenHocPhan = buildSemesterTitle(mahk, hocKyTen, kqhk, earnedCredits);
				// Thêm 1 hàng trống => Tên học kỳ
				res.push({ _id: `semester-${mahk}`, tenHocPhan, maHocKy: mahk, hocKyTen, isSemesterHeader: true } as DataType);
				// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
				res.push(...diemHpHkData);
			});

			setDiemSvList(diemSv);
			setData(res);
		});
	}, [buildSemesterTitle, maKhoaNganh]);

	useEffect(() => {
		if (!danhSachDauDiem.length) getDauDiem();
	}, []);

	useEffect(() => {
		setMaHocKyFilter('all');
		getData();
	}, [getData]);

	const hocKyOptions = useMemo(
		() =>
			data.filter(isSemesterRow).map((item) => ({
				value: item.maHocKy!,
				label: item.hocKyTen ?? item.maHocKy!,
			})),
		[data],
	);

	const tableData = useMemo(() => filterBySemester(data, maHocKyFilter), [data, maHocKyFilter]);
	const hasTableRows = tableData.length > 0;

	const handleShowHocPhan = useCallback((rec: DataType) => {
		if (isSemesterRow(rec)) return;
		setRecDiem(rec);
		setVisibleDiem(true);
	}, []);

	const listDiemSelected = useMemo(() => {
		if (!recDiem?.maHocPhan) return [];
		return diemSvList.filter((item) => item.maHocPhan === recDiem.maHocPhan);
	}, [diemSvList, recDiem?.maHocPhan]);

	const semesterRowStyle = {
		fontWeight: 600,
		backgroundColor: '#e8fafdbf',
	};

	const onCell = (rec: DataType) => ({
		colSpan: isSemesterRow(rec) ? 0 : 1,
		style: isSemesterRow(rec) ? semesterRowStyle : undefined,
	});

	const onCellHocPhan = (rec: DataType) => {
		const baseCell = onCell(rec);
		if (isSemesterRow(rec)) return baseCell;

		return {
			...baseCell,
			onClick: () => handleShowHocPhan(rec),
			style: {
				...(baseCell.style ?? {}),
				cursor: 'pointer',
			},
		};
	};

	const isPassTrongChuongTrinh = (rec: DataType) => rec.dat === true && rec.trongChuongTrinh === true;
	const isTichLuyDiem = (rec: DataType) => isPassTrongChuongTrinh(rec) && rec.tichLuy === true;

	const renderSoTinChiTichLuy = (rec: DataType) => {
		if (rec.trongChuongTrinh && (rec.dat === false || rec.diemChu === ELoaiDiemChu.F)) {
			return <b style={{ color: 'red' }}>0</b>;
		}

		if (isPassTrongChuongTrinh(rec)) {
			return rec?.hocPhan?.soTinChi ?? '';
		}

		return '';
	};

	const columns: IColumn<DataType>[] = useMemo(() => {
		const cols: IColumn<DataType>[] = [
			{
				title: intl.formatMessage({ id: 'global.table.column.tt' }),
				dataIndex: 'title',
				width: 56,
				align: 'center',
				render: (val, rec) => (isSemesterRow(rec) ? rec.tenHocPhan : val),
				onCell,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.maHp' }),
				dataIndex: 'maHocPhan',
				width: 120,
				align: 'center',
				filterType: 'string',
				render: (val, rec) => {
					if (isSemesterRow(rec) || !val) return val;

					const content = rec.trongChuongTrinh ? val : <u className='text-warning'>{val}</u>;

					return rec.trongChuongTrinh ? (
						content
					) : (
						<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.diemtp.notInProgram' })}>{content}</Tooltip>
					);
				},
				onCell: onCellHocPhan,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tenHp' }),
				dataIndex: 'tenHocPhan',
				width: 320,
				filterType: 'string',
				ellipsis: true,
				render: (val, rec) => {
					if (isSemesterRow(rec) || !val) return val;
					return val;
				},
				onCell: onCellHocPhan,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.soTc' }),
				width: 112,
				align: 'center',
				render: (val, rec) => rec?.hocPhan?.soTinChi,
				onCell,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.soTcTichLuy' }),
				width: 112,
				align: 'center',
				render: (val, rec) => renderSoTinChiTichLuy(rec),
				onCell,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tichLuy' }),
				dataIndex: 'tichLuy',
				width: 80,
				align: 'center',
				render: (val, rec) => isTichLuyDiem(rec) && <CheckOutlined />,
				onCell,
			},
			// {
			// 	title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.diemThi1' }),
			// 	width: 96,
			// 	dataIndex: 'diemThi1',
			// 	align: 'center',
			// 	// sortable: true,
			// 	onCell,
			// },
			// {
			// 	title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.diemThi2' }),
			// 	width: 96,
			// 	dataIndex: 'diemThi2',
			// 	align: 'center',
			// 	// sortable: true,
			// 	onCell,
			// },
			// {
			// 	title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tongKet10' }),
			// 	dataIndex: 'diemTongKet',
			// 	align: 'center',
			// 	render: (val) => <b style={(val || val === 0) && val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			// 	width: 60,
			// 	// sortable: true,
			// 	onCell,
			// },
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tongKet4' }),
				width: 100,
				dataIndex: 'diemThang4',
				align: 'center',
				render: (val) => <b style={val === 0 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
				// sortable: true,
				onCell,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tongKetChu' }),
				width: 104,
				dataIndex: 'diemChu',
				align: 'center',
				fixed: 'right',
				filterType: 'select',
				filterData: Object.values(ELoaiDiemChu),
				render: (val, rec) => (
					<>
						<Tag color={ColorDiemChu?.[val as ELoaiDiemChu]}>{val === ELoaiDiemChu.CHUA_DU_DU_LIEU ? '--' : val}</Tag>{' '}
						{rec?.isCongNhanQuyDoiDiem && (
							<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.diemtp.convertedScore' })}>(R)</Tooltip>
						)}
					</>
				),
				onCell,
			},
		];

		const colCount = cols.length;
		cols[0] = {
			...cols[0],
			onCell: (rec) => ({
				colSpan: isSemesterRow(rec) ? colCount : 1,
				style: isSemesterRow(rec) ? { ...semesterRowStyle, textAlign: 'left' } : undefined,
			}),
		};

		// const dauDiemCols: IColumn<LopHocPhan.IDiemHpSvHk>[] = danhSachDauDiem.map((item) => ({
		// 	title: item.ma ?? item.ten,
		// 	width: 80,
		// 	dataIndex: `diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk,
		// 	align: 'center',
		// 	// sortable: true,
		// 	onCell,
		// }));
		// cols.splice(5, 0, {
		// 	title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.diemThanhPhan' }),
		// 	width: 80,
		// 	children: dauDiemCols,
		// });

		return cols;
	}, [handleShowHocPhan, intl]);

	return (
		<>
			{/* <div style={{ marginBottom: 12 }}>
				{intl.formatMessage({ id: 'ketquahoctap.diemtp.title' })}
				<br />
				{intl.formatMessage({ id: 'ketquahoctap.diemtp.viewProgress' })}{' '}
				<a
					href='./tien-trinh-hoc-tap'
					onClick={(e) => {
						e.preventDefault();
						history.push('./tien-trinh-hoc-tap');
					}}
				>
					{intl.formatMessage({ id: 'ketquahoctap.diemtp.here' })}
				</a>
				.
			</div> */}
			<TableStaticData
				loading={loading}
				onReload={getData}
				scroll={hasTableRows ? { y: 660 } : undefined}
				otherProps={{
					loading: loading,
					pagination: false,
					style: { width: '100%' },
					onRow: (rec: DataType) =>
						isSemesterRow(rec)
							? {
									style: semesterRowStyle,
									className: 'diem-tp-semester-row',
								}
							: {},
				}}
				otherButtons={[
					<Space wrap>
						<Select
							style={{ minWidth: 220 }}
							value={maHocKyFilter}
							onChange={setMaHocKyFilter}
							options={[
								{
									value: 'all',
									label: intl.formatMessage({ id: 'ketquahoctap.diemtp.filter.allSemesters' }),
								},
								...hocKyOptions,
							]}
							placeholder={intl.formatMessage({ id: 'ketquahoctap.diemtp.filter.semester' })}
						/>
					</Space>,
				]}
				data={tableData}
				columns={columns}
				globalSearch={false}
			></TableStaticData>

			<ModalChiTietDiem
				visible={visibleDiem}
				setVisible={setVisibleDiem}
				hocPhan={recDiem?.hocPhan}
				listDiem={listDiemSelected}
				maKhoaNganh={maKhoaNganh}
				khoiChuongTrinh={recDiem?.khoiHpCt}
			/>
		</>
	);
};

export default DiemThanhPhanSV;
