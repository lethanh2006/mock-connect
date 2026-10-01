import { IconCheckCircle } from '@/components/Icons';
import Select from '@/components/MySelect';
import Tooltip from '@/components/MyTooltip';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { primaryColor } from '@/services/base/constant';
import { FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Space, Tag, theme, Typography } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalBangDiemTranscript from '../BangDiemTranscript/ModalBangDiemTranscript';
import DiemChuMarks from './DiemChuMarks';
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

const LETTER_GRADE_COLORS: Partial<Record<ELoaiDiemChu, string>> = {
	[ELoaiDiemChu.A_PLUS]: '#16A34A',
	[ELoaiDiemChu.A]: '#16A34A',
	[ELoaiDiemChu.A_MINUS]: '#16A34A',
	[ELoaiDiemChu.B_PLUS]: '#0088FF',
	[ELoaiDiemChu.B]: '#0088FF',
	[ELoaiDiemChu.B_MINUS]: '#0088FF',
	[ELoaiDiemChu.F]: '#DC2626',
	[ELoaiDiemChu.NCR]: '#DC2626',
};

const isSemesterRow = (rec: DataType) => rec.isSemesterHeader === true;

const filterBySemester = (rows: DataType[], maHocKy: string) => {
	if (maHocKy === 'all') return rows;

	return rows.filter((row) => row.maHocKy === maHocKy);
};

const DiemThanhPhanSV = (props: { maKhoaNganh?: string }) => {
	const intl = useIntl();
	const { token } = theme.useToken();
	const { maKhoaNganh } = props;
	const { record: sinhVien } = useModel('sinhvien.sinhvien');
	const { getKetQuaHocKy } = useModel('daotao.ketquahocky');
	const { getDiemSvHk, loading } = useModel('daotao.diemhpsvhk');
	const { danhSach: danhSachDauDiem } = useModel('daotao.daudiemhocphan');
	const [maHocKyFilter, setMaHocKyFilter] = useState<string>('all');
	const [data, setData] = useState<DataType[]>([]);
	const [diemSvList, setDiemSvList] = useState<LopHocPhan.IDiemHpSvHk[]>([]);
	const [kqhkList, setKqhkList] = useState<KetQuaHocKy.IRecord[]>([]);
	const [visibleDiem, setVisibleDiem] = useState(false);
	const [visibleGpaInfo, setVisibleGpaInfo] = useState(false);
	const [visibleTranscript, setVisibleTranscript] = useState(false);
	const [recDiem, setRecDiem] = useState<DataType | null>(null);

	const buildSemesterTitle = useCallback(
		(
			mahk: string,
			hocKyTen: string | undefined,
			kqhk?: {
				trungBinhHocKyThang4?: number | null;
				trungBinhHocKyAll?: number | null;
				tongSoTinChiHocKy?: number | null;
				tongSoTinChiTichLuyToanKhoa?: number | null;
			},
		) => {
			let title = hocKyTen ?? intl.formatMessage({ id: 'ketquahoctap.diemtp.semester.default' }, { maHocKy: mahk });
			if (kqhk) {
				title += intl.formatMessage(
					{ id: 'ketquahoctap.diemtp.semester.summary' },
					{
						gpa: kqhk?.trungBinhHocKyAll ?? kqhk?.trungBinhHocKyThang4 ?? '--',
						earned: kqhk.tongSoTinChiHocKy ?? '--',
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

				const tenHocPhan = buildSemesterTitle(mahk, hocKyTen, kqhk);
				// Thêm 1 hàng trống => Tên học kỳ
				res.push({ _id: `semester-${mahk}`, tenHocPhan, maHocKy: mahk, hocKyTen, isSemesterHeader: true } as DataType);
				// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
				res.push(...diemHpHkData);
			});

			setDiemSvList(diemSv);
			setKqhkList(kqhkList);
			setData(res);
		});
	}, [buildSemesterTitle, maKhoaNganh]);

	// useEffect(() => {
	// 	if (!danhSachDauDiem.length) getDauDiem();
	// }, []);

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
		backgroundColor: token.colorInfoBg,
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
	const isTichLuyDiem = (rec: DataType) => rec.tichLuy === true;

	const renderSoTinChiTichLuy = (rec: DataType) => {
		if (isPassTrongChuongTrinh(rec)) {
			return rec?.hocPhan?.soTinChi ?? '';
		}

		return '--';
	};

	const columns: IColumn<DataType>[] = useMemo(() => {
		const cols: IColumn<DataType>[] = [
			{
				title: intl.formatMessage({ id: 'global.table.column.tt' }),
				dataIndex: 'title',
				width: 56,
				render: (val, rec) => (isSemesterRow(rec) ? rec.tenHocPhan : val),
				onCell: onCellHocPhan,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.maHp' }),
				dataIndex: 'maHocPhan',
				width: 120,
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
				dataIndex: ['hocPhan', 'soTinChi'],
				onCell: onCellHocPhan,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.soTcTichLuy' }),
				width: 112,
				render: (val, rec) => renderSoTinChiTichLuy(rec),
				onCell: onCellHocPhan,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tichLuy' }),
				dataIndex: 'tichLuy',
				width: 80,
				align: 'center',
				render: (val, rec) =>
					isTichLuyDiem(rec) && <IconCheckCircle size={20} style={{ color: token.colorSuccess }} aria-hidden='true' />,
				onCell: onCellHocPhan,
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
				render: (val, rec) => (
					<b style={{ color: val === 0 && rec.diemChu === ELoaiDiemChu.F ? 'red' : undefined }}>{val ?? '--'}</b>
				),
				// sortable: true,
				onCell: onCellHocPhan,
			},
			{
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.tongKetChu' }),
				width: 104,
				dataIndex: 'diemChu',
				align: 'center',
				filterType: 'select',
				filterData: Object.values(ELoaiDiemChu),
				render: (val, rec) => (
					<>
						<Tag color={LETTER_GRADE_COLORS[val as ELoaiDiemChu] ?? ColorDiemChu?.[val as ELoaiDiemChu]}>
							{val === ELoaiDiemChu.CHUA_DU_DU_LIEU ? '--' : val}
						</Tag>
						{!isSemesterRow(rec) && (
							<DiemChuMarks
								diemChu={rec.diemChu}
								isQuyDoi={rec.isCongNhanQuyDoiDiem}
								soLanHoc={maKhoaNganh ? rec.infoKhoaNganh?.[maKhoaNganh]?.soLanHoc : undefined}
								quyDoiExtra={
									rec.coTichLuyQuyDoi ? ` - ${intl.formatMessage({ id: 'lophocphan.id.ketqua.tichluy' })}` : undefined
								}
							/>
						)}
					</>
				),
				onCell: onCellHocPhan,
			},
		];

		const dauDiemCols: IColumn<DataType>[] = danhSachDauDiem.map((item) => ({
			title: item.ma ?? item.ten,
			width: 80,
			dataIndex: `diemThanhPhan${item.field}` as keyof DataType,
			align: 'center',
			// sortable: true,
			onCell,
		}));
		if (dauDiemCols.length) {
			cols.splice(6, 0, {
				title: intl.formatMessage({ id: 'ketquahoctap.diemtp.col.diemThanhPhan' }),
				width: dauDiemCols.length * 80,
				children: dauDiemCols,
			});
		}

		const colCount = cols.reduce((total, col) => {
			if (col.hide) return total;

			return total + (col.children?.filter((child) => child.hide !== true).length || 1);
		}, 0);
		cols[0] = {
			...cols[0],
			onCell: (rec) => ({
				colSpan: isSemesterRow(rec) ? colCount : 1,
				style: isSemesterRow(rec) ? { ...semesterRowStyle, textAlign: 'left' } : undefined,
			}),
		};

		return cols;
	}, [danhSachDauDiem, handleShowHocPhan, intl, maKhoaNganh, token.colorInfoBg, token.colorSuccess]);

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
					loading,
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
						<ButtonExtend
							icon={<FileTextOutlined />}
							disabled={!maKhoaNganh || !sinhVien?.ssoId}
							tooltip={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2' })}
							onClick={() => setVisibleTranscript(true)}
						/>
						<Select
							style={{ width: 'clamp(140px, 45vw, 250px)', height: 36 }}
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
				otherTextButtons={[
					<ButtonExtend
						key='gpa-info'
						type='link'
						icon={<InfoCircleOutlined style={{ color: primaryColor }} />}
						tooltip={intl.formatMessage({ id: 'ketquahoctap.diemtp.gpaInfo.tooltip' })}
						onClick={() => setVisibleGpaInfo(true)}
					/>,
				]}
				data={tableData}
				columns={columns}
				globalSearch={false}
			>
				{/* <Segmented
					value={loaiHocPhan}
					onChange={(val) => setLoaiHocPhan(val.toString())}
					options={[
						{ value: 'all', label: intl.formatMessage({ id: 'ketquahoctap.diemtp.filter.allCourses' }) },
						// { value: 'fail', label: 'Học phần chưa đạt' },
					]}
				/> */}
			</TableStaticData>
			<Modal
				open={visibleGpaInfo}
				title={intl.formatMessage({ id: 'ketquahoctap.diemtp.gpaInfo.title' })}
				onCancel={() => setVisibleGpaInfo(false)}
				footer={null}
				width={760}
			>
				<Typography.Paragraph style={{ marginBottom: 12 }}>
					{intl.formatMessage({ id: 'ketquahoctap.diemtp.gpaInfo.intro' })}
				</Typography.Paragraph>
				<ul style={{ paddingLeft: 20, marginBottom: 12 }}>
					<li style={{ marginBottom: 8 }}>{intl.formatMessage({ id: 'ketquahoctap.diemtp.gpaInfo.semGpa' })}</li>
					<li>{intl.formatMessage({ id: 'ketquahoctap.diemtp.gpaInfo.cumGpa' })}</li>
				</ul>
				<Typography.Text italic type='secondary'>
					{intl.formatMessage({ id: 'ketquahoctap.diemtp.gpaInfo.note' })}
				</Typography.Text>
			</Modal>
			<ModalChiTietDiem
				visible={visibleDiem}
				setVisible={setVisibleDiem}
				hocPhan={recDiem?.hocPhan}
				listDiem={listDiemSelected}
				maKhoaNganh={maKhoaNganh}
				khoiChuongTrinh={recDiem?.khoiHpCt}
			/>
			{maKhoaNganh && sinhVien?.ssoId && (
				<ModalBangDiemTranscript
					open={visibleTranscript}
					onFinish={() => setVisibleTranscript(false)}
					sinhVienSsoId={sinhVien.ssoId}
					maKhoaNganh={maKhoaNganh}
					kqhkList={kqhkList}
					diemList={diemSvList}
				/>
			)}
		</>
	);
};

export default DiemThanhPhanSV;
