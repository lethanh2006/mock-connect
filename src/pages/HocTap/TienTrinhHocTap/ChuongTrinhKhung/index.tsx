import EmptyState from '@/components/EmptyState';
import { IconGear, IconRotateArrow } from '@/components/Icons';
import Segmented from '@/components/MySegmented';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { Collapse, Divider, Space, Spin, Tag, Typography } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import CardHocPhanV2 from '../components/CardHocPhan';
import CardKhoiHocPhan from '../components/CardKhoiHocPhan';
import SearchTienTrinh from '../components/SearchTienTrinh';
import './style.less';

const { Title } = Typography;

const GLOBAL_SEARCH_KEY = 'CHUONG_TRINH_KHUNG_SEARCH';

const sortByCourseName = (list: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) =>
	_.sortBy(list, [
		(item) => item.hocPhan?.ten?.toLowerCase() || item.ten?.toLowerCase() || '',
		(item) => (item.chuyenNganh?.ten || item.khoiKienThuc?.ten || '').toLowerCase(),
	]);

const sortBySemester = (list: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) =>
	_.sortBy(list, [
		(item) => item.soThuTuKy ?? Number.MAX_SAFE_INTEGER,
		(item) => (item.chuyenNganh?.ten || item.khoiKienThuc?.ten || '').toLowerCase(),
		(item) => item.hocPhan?.ten?.toLowerCase() || item.ten?.toLowerCase() || '',
	]);

const matchKhoiHocPhan = (item: ChuongTrinhDaoTao.IKhoiHocPhanCTDT, keyword: string): boolean => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	if (!normalizedKeyword) return true;

	const searchableValues = [
		item.hocPhan?.ma,
		item.hocPhan?.ten,
		item.hocPhan?.tenTiengAnh,
		item.ten,
		item.khoiKienThuc?.ten,
		item.chuyenNganh?.ten,
	];

	if (searchableValues.some((value) => value?.toLowerCase().includes(normalizedKeyword))) return true;

	return (
		item.hocPhanCtdtList?.some((child) => {
			const childValues = [child.hocPhan?.ma, child.hocPhan?.ten, child.hocPhan?.tenTiengAnh];
			return childValues.some((value) => value?.toLowerCase().includes(normalizedKeyword));
		}) ?? false
	);
};

type TChuongTrinhHocKy = {
	khoiHocPhan: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
	soThuTuKy?: number;
	maKhoiKienThuc?: string;
	tenKhoiKienThuc?: string;
	soTinChiPhaiHoc?: number;
	soTinChiTuChon?: number;
	soTinChiDaDat?: number;
	chuyenNganhList?: TChuongTrinhHocKy[];
};

const TienTrinhChuongTrinhKhung = (props: { data?: ChuongTrinhDaoTao.TTienTrinhKhung }) => {
	const intl = useIntl();
	const { loading: loadingModel, sinhVienGetTienTrinhKhungModel } = useModel('daotao.chuongtrinhdaotao');
	const loading = !props.data && loadingModel;
	const { khoaNganhMe, maKhoaNganh, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [rawData, setRawData] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>([]);
	const [minorData, setMinorData] = useState<ChuongTrinhDaoTao.TTienTrinhKhungMinor[]>([]);
	const [recChuongTrinh, setChuongTrinh] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>();
	const [viewType, setViewType] = useState<'semester' | 'block'>('semester');
	const [searchText, setSearchText] = useState('');
	const [mapColorKhoiKienThuc, setMapColorKhoiKienThuc] = useState<Record<string, string>>({});
	const [visibleDiem, setVisibleDiem] = useState(false);
	// const { cctFilter } = useAccess();
	const [visibleChuongTrinh, setVisibleChuongTrinh] = useState(false);
	const isSongNganh = maKhoaNganh === khoaNganhMe?.khoaNganhPhu?.ma;
	const chuyenNganhHienTai = isSongNganh ? recSinhVien?.chuyenNganh2 : recSinhVien?.chuyenNganh;

	const normalizeTienTrinhKhung = (data: unknown): ChuongTrinhDaoTao.TTienTrinhKhung => {
		if (Array.isArray(data)) return { tienTrinh: data, minors: [] };

		const nextData = data as Partial<ChuongTrinhDaoTao.TTienTrinhKhung> | undefined;
		return {
			tienTrinh: Array.isArray(nextData?.tienTrinh) ? nextData.tienTrinh : [],
			minors: Array.isArray(nextData?.minors) ? nextData.minors : [],
		};
	};

	const getColorMap = (listKhoiHpCt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const listKhoi = _.uniq(listKhoiHpCt.map((item) => item.maKhoiKienThuc));
		const temp: Record<string, string> = {};
		listKhoi?.forEach(
			(khoi) =>
				(temp[khoi as string] =
					`rgb(${Math.random() * 190 + 15}, ${Math.random() * 190 + 15}, ${Math.random() * 190 + 15})`),
		);
		setMapColorKhoiKienThuc(temp);
	};

	const fetch = async () => {
		const data = props.data ?? (await sinhVienGetTienTrinhKhungModel(isSongNganh));
		const nextData = normalizeTienTrinhKhung(data);
		setRawData(nextData.tienTrinh);
		setMinorData(nextData.minors);
		getColorMap(nextData.tienTrinh);
	};

	const danhSachHienThi = useMemo(() => {
		if (!rawData?.length) return [];

		const isBlockView = viewType === 'block';
		const maChuyenNganhHienTai = isSongNganh ? recSinhVien?.maChuyenNganh2 : recSinhVien?.maChuyenNganh;
		// Lọc cứng theo chuyên ngành hiện tại, loại bỏ các môn thuộc chuyên ngành khác.
		const dataAfterMajorFilter = rawData.filter((item) => {
			if (!item.maChuyenNganh || !maChuyenNganhHienTai) return true;
			return item.maChuyenNganh === maChuyenNganhHienTai;
		});

		if (!isBlockView) {
			const gData = _.groupBy(dataAfterMajorFilter, (item) => item.soThuTuKy);
			const sortedEntries = Object.entries(gData).sort(([a], [b]) => Number(a) - Number(b));

			return sortedEntries.map(([key, group]) => {
				const uniqchuyenNganh = _.uniq(group.filter((item) => !!item.maChuyenNganh).map((item) => item.maChuyenNganh));

				const khoiHocPhan = sortByCourseName(group.filter((item) => !item.maChuyenNganh || uniqchuyenNganh.length < 2));
				const da1 = group.filter(
					(item) =>
						!item.maChuyenNganh ||
						item.maChuyenNganh === maChuyenNganhHienTai ||
						item.maChuyenNganh === uniqchuyenNganh?.[0],
				);
				const soTinChiPhaiHoc = _.sumBy(da1, (item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0);
				const soTinChiTuChon = _.sumBy(da1, (item) => item.soTinChiTuChonPhaiHoc || 0);

				const chuyenNganh = group.filter((item) => !!item.maChuyenNganh && uniqchuyenNganh.length >= 2);
				const chuyenNganhList = Object.values(_.groupBy(chuyenNganh, (item) => item.maChuyenNganh)).map((item) => ({
					khoiHocPhan: sortByCourseName(item),
					tenChuyenNganh: undefined as string | undefined,
					maChuyenNganh: item[0].maChuyenNganh,
				}));

				return {
					khoiHocPhan,
					soTinChiPhaiHoc,
					soTinChiTuChon,
					chuyenNganhList,
					soThuTuKy: group[0].soThuTuKy,
					maKhoiKienThuc: undefined as string | undefined,
					tenKhoiKienThuc: undefined as string | undefined,
					soMonDaHoc: undefined as number | undefined,
					tongSoMon: undefined as number | undefined,
				};
			});
		}

		// VIEW BLOCK: Nhóm theo Root Block (maCha || ma)
		const gData = _.groupBy(dataAfterMajorFilter, (item) => item.khoiKienThuc?.maCha || item.maKhoiKienThuc);
		const sortedEntries = Object.entries(gData).sort(([keyA, groupA], [keyB, groupB]) => {
			const orderA = groupA[0].khoiKienThuc?.soThuTu ?? (groupA[0].khoiKienThuc?.khoiCha?.soThuTu || 999);
			const orderB = groupB[0].khoiKienThuc?.soThuTu ?? (groupB[0].khoiKienThuc?.khoiCha?.soThuTu || 999);
			return orderA - orderB;
		});

		return sortedEntries.map(([rootId, group]) => {
			// Xác định tên Root Block
			const rootItem = group.find((it) => !it.khoiKienThuc?.maCha);
			const tenKhoiKienThuc =
				rootItem?.khoiKienThuc?.ten ||
				group.find((it) => it.khoiKienThuc?.khoiCha?.ten)?.khoiKienThuc?.khoiCha?.ten ||
				group[0].khoiKienThuc?.ten;

			const uniqchuyenNganh = _.uniq(group.filter((item) => !!item.maChuyenNganh).map((item) => item.maChuyenNganh));
			const khoiHocPhan = sortBySemester(group.filter((item) => !item.maChuyenNganh || uniqchuyenNganh.length < 2));
			const chuyenNganhList = Object.values(
				_.groupBy(
					group.filter((item) => !!item.maChuyenNganh && uniqchuyenNganh.length >= 2),
					(item) => item.maChuyenNganh,
				),
			).map((item) => ({
				khoiHocPhan: sortBySemester(item),
				tenChuyenNganh: undefined as string | undefined,
				maChuyenNganh: item[0].maChuyenNganh,
			}));
			const soTinChiPhaiHoc = _.sumBy(group, (item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0);

			return {
				khoiHocPhan,
				soTinChiPhaiHoc,
				soTinChiTuChon: undefined as number | undefined,
				chuyenNganhList,
				soThuTuKy: undefined as number | undefined,
				maKhoiKienThuc: rootId,
				tenKhoiKienThuc,
				// Thống kê môn học (Dùng so sánh chuỗi hoặc Enum nếu có)
				soMonDaHoc: group.filter(
					(item) => item.hoc === ETrangThaiHocTap.DA_HOC || item.hoc === ETrangThaiHocTap.DANG_HOC,
				).length,
				tongSoMon: group.length,
			};
		});
	}, [rawData, viewType, isSongNganh, recSinhVien?.maChuyenNganh, recSinhVien?.maChuyenNganh2]);

	const filteredDanhSachHienThi = useMemo(() => {
		if (!searchText.trim()) return danhSachHienThi;

		return danhSachHienThi
			.map((group) => {
				const khoiHocPhan = group.khoiHocPhan.filter((item) => matchKhoiHocPhan(item, searchText));
				const chuyenNganhList = group.chuyenNganhList
					?.map((chuyenNganh) => ({
						...chuyenNganh,
						khoiHocPhan: chuyenNganh.khoiHocPhan.filter((item) => matchKhoiHocPhan(item, searchText)),
					}))
					.filter((chuyenNganh) => chuyenNganh.khoiHocPhan.length > 0);

				return {
					...group,
					khoiHocPhan,
					chuyenNganhList,
				};
			})
			.filter((group) => group.khoiHocPhan.length > 0 || (group.chuyenNganhList?.length ?? 0) > 0);
	}, [danhSachHienThi, searchText]);

	useEffect(() => {
		fetch();
	}, [isSongNganh, maKhoaNganh, props.data]);

	const renderHocPhan = (
		data: TChuongTrinhHocKy | { khoiHocPhan: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[] },
		getLabel?: (item: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => React.ReactNode,
	) => (
		<div className='grid-container'>
			{data.khoiHocPhan.map((ctk) =>
				ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC || ctk.hocPhan ? (
					<CardHocPhanV2
						key={ctk._id}
						hocPhan={ctk.hocPhan ?? undefined}
						colorKhoiKienThuc={mapColorKhoiKienThuc?.[ctk.maKhoiKienThuc!]}
						onClick={() => {
							setChuongTrinh(ctk);
							setVisibleDiem(true);
						}}
						trangThaiHoc={ctk.hoc}
						listDiem={ctk.lichSuDiem}
						label={getLabel?.(ctk)}
					/>
				) : (
					<CardKhoiHocPhan
						khoi={ctk}
						key={ctk._id}
						colorKhoiKienThuc={mapColorKhoiKienThuc?.[ctk.maKhoiKienThuc!]}
						onClickHocPhan={(record) => {
							setChuongTrinh(record);
							setVisibleDiem(true);
						}}
						label={getLabel?.(ctk)}
					/>
				),
			)}
		</div>
	);

	const getMinorName = (minor: ChuongTrinhDaoTao.TTienTrinhKhungMinor) =>
		minor.nganhMinor?.tenTiengViet ??
		minor.nganhMinor?.ten ??
		minor.nganhMinor?.tenTiengAnh ??
		minor.nganhMinor?.ma ??
		intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' });

	const hasMinorData = minorData.some((minor) => (minor.khoiHpCtList?.length ?? 0) > 0);

	const totalCourses = useMemo(() => {
		const mainCount = filteredDanhSachHienThi.reduce((sum, group) => {
			const cnCount = (group.chuyenNganhList ?? []).reduce((cSum, cn) => cSum + (cn.khoiHocPhan?.length ?? 0), 0);
			return sum + (group.khoiHocPhan?.length ?? 0) + cnCount;
		}, 0);
		const minorCount = minorData.reduce((sum, minor) => sum + (minor.khoiHpCtList?.length ?? 0), 0);
		return mainCount + minorCount;
	}, [filteredDanhSachHienThi, minorData]);

	return (
		<div className='tien-trinh-tab-content'>
			<div className='view-switch-container'>
				<div className='view-switch-left'>
					<ButtonExtend
						icon={<IconGear />}
						tooltip={intl.formatMessage({ id: 'global.setting', defaultMessage: 'Cài đặt' })}
					/>
					<SearchTienTrinh storageKey={GLOBAL_SEARCH_KEY} value={searchText} onChange={setSearchText} />
					<div className='total tien-trinh-total'>
						{intl.formatMessage({ id: 'global.tablestatic.button.tongso', defaultMessage: 'Total' })}:
						<span>{totalCourses}</span>
					</div>
				</div>
				<Space wrap className='view-switch-actions'>
					<ButtonExtend
						icon={<IconRotateArrow />}
						onClick={fetch}
						loading={loading}
						className='btn-reload'
						tooltip={intl.formatMessage({ id: 'global.table.index.button.tailai.tooltip' })}
					/>
					<Segmented
						value={viewType}
						size='small'
						className='view-switch-segmented'
						onChange={(val) => setViewType(val as any)}
						options={[
							{
								label: intl.formatMessage({ id: 'tientrinhhoctap.view.semester' }),
								value: 'semester',
							},
							{
								label: intl.formatMessage({ id: 'tientrinhhoctap.view.block' }),
								value: 'block',
							},
						]}
					/>
				</Space>
			</div>

			<Spin spinning={loading}>
				{!filteredDanhSachHienThi?.length && !hasMinorData ? (
					<EmptyState className='my-8' description={intl.formatMessage({ id: 'global.table.index.empty' })} />
				) : null}
				{filteredDanhSachHienThi?.map((data, index) => (
					<React.Fragment key={viewType === 'semester' ? data.soThuTuKy : data.maKhoiKienThuc}>
						{/* Header học kỳ/Khối */}
						<Divider orientation='left' className='divider-big-title' dashed>
							<div className='header-content'>
								<Title level={5} style={{ margin: 0, color: 'var(--ds-function-link)' }}>
									{viewType === 'semester'
										? `${intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hocky' })} ${data.soThuTuKy}`
										: data.tenKhoiKienThuc || intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khongten' })}
								</Title>
								{viewType === 'semester' && (
									<Tag color='blue'>
										{data.soTinChiPhaiHoc} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tinchi' })}
									</Tag>
								)}

								{/* Nhãn thống kê số môn (chỉ hiện ở chế độ Block) */}
								{viewType === 'block' && (
									<Tag color='blue'>
										{data.soMonDaHoc}/{data.tongSoMon} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.courses' })}
									</Tag>
								)}
							</div>
						</Divider>

						{/* Grid các môn học */}
						{renderHocPhan(data, (item) => {
							if (viewType === 'semester') {
								const name = item.chuyenNganh?.ten || item.khoiKienThuc?.ten;
								return name ? (
									<>
										<span
											className='card-label-dot'
											style={{
												backgroundColor: `var(--color-primary)`,
											}}
										/>
										{name}
									</>
								) : undefined;
							}
							const semester = item.soThuTuKy;
							if (!semester) return undefined;

							return (
								<>
									<span
										className='card-label-dot'
										style={{
											backgroundColor: `var(--color-primary)`,
										}}
									/>
									{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hocky' })} {semester}
								</>
							);
						})}

						{data.chuyenNganhList?.map((chuyenNganh) => {
							const panelKey =
								chuyenNganh.maChuyenNganh ||
								chuyenNganh.khoiHocPhan[0].maChuyenNganh ||
								chuyenNganh.khoiHocPhan[0].maKhoiKienThuc ||
								'';

							return (
								<Collapse
									key={panelKey}
									bordered
									style={{ marginTop: 16 }}
									defaultActiveKey={[chuyenNganhHienTai?.ma ?? '']}
								>
									<Collapse.Panel
										key={panelKey}
										style={{ backgroundColor: 'var(--ds-bg-tiled-sm)' }}
										header={
											<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
												<span style={{ fontWeight: 500 }}>
													{viewType === 'semester'
														? intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' }) + ': '
														: null}
													{chuyenNganh.tenChuyenNganh ??
														chuyenNganh.khoiHocPhan[0].chuyenNganh?.ten ??
														chuyenNganh.khoiHocPhan[0].maChuyenNganh}
												</span>
											</div>
										}
									>
										{renderHocPhan(chuyenNganh, (item) => {
											if (viewType === 'semester') {
												const name = item.khoiKienThuc?.ten;
												return name ? (
													<>
														<span
															className='card-label-dot'
															style={{
																backgroundColor: `var(--color-primary)`,
															}}
														/>
														{name}
													</>
												) : undefined;
											}
											const semester = item.soThuTuKy;
											if (!semester) return undefined;

											return (
												<>
													<span
														className='card-label-dot'
														style={{
															backgroundColor: `var(--color-primary)`,
														}}
													/>
													{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hocky' })} {semester}
												</>
											);
										})}
									</Collapse.Panel>
								</Collapse>
							);
						})}
					</React.Fragment>
				))}

				{hasMinorData && (
					<>
						<Divider orientation='left' className='divider-big-title' dashed>
							<div className='header-content'>
								<Title level={5} style={{ margin: 0, color: 'var(--ds-function-link)' }}>
									{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}
								</Title>
								<Tag color='blue'>
									{_.sumBy(minorData, (minor) => minor.khoiHpCtList?.length ?? 0)}{' '}
									{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.courses' })}
								</Tag>
							</div>
						</Divider>

						{minorData.map((minor, index) => {
							const minorName = getMinorName(minor);
							const khoiHocPhan = minor.khoiHpCtList ?? [];
							if (!khoiHocPhan.length) return null;

							return (
								<React.Fragment key={minor.idPhieu ?? minor.nganhMinor?.ma ?? index}>
									{renderHocPhan({ khoiHocPhan }, () => (
										<>
											<span
												className='card-label-dot'
												style={{
													backgroundColor: `var(--color-primary)`,
												}}
											/>
											{minorName}
										</>
									))}
								</React.Fragment>
							);
						})}
					</>
				)}
			</Spin>

			<ModalChiTietDiem
				preview={!!props.data}
				setVisible={setVisibleDiem}
				visible={visibleDiem}
				hocPhan={recChuongTrinh?.hocPhan ?? undefined}
				listDiem={recChuongTrinh?.lichSuDiem ?? []}
				maKhoaNganh={maKhoaNganh}
				khoiChuongTrinh={recChuongTrinh}
				trangThaiHoc={recChuongTrinh?.hoc}
			/>

			{!props.data && <ChuongTrinhDaoTaoModalView visible={visibleChuongTrinh} setVisible={setVisibleChuongTrinh} />}
		</div>
	);
};

export default TienTrinhChuongTrinhKhung;
