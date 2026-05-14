import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { Collapse, Divider, Segmented, Spin, Tag, Typography } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import CardHocPhanV2 from '../components/CardHocPhan';
import CardKhoiHocPhan from '../components/CardKhoiHocPhan';
import './style.less';

const { Title } = Typography;

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

const TienTrinhChuongTrinhKhung = () => {
	const intl = useIntl();
	const {
		loading,
		sinhVienGetTienTrinhKhungModel,
		record: recChuongTrinh,
		setRecord: setChuongTrinh,
	} = useModel('daotao.chuongtrinhdaotao');
	const { khoaNganhMe, maKhoaNganh, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh } = useModel('sinhvien.tientrinhtotnghiep');
	const [rawData, setRawData] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>([]);
	const [viewType, setViewType] = useState<'semester' | 'block'>('semester');
	const { registeredPathway } = useModel('sinhvien.pathway');
	const [mapColorKhoiKienThuc, setMapColorKhoiKienThuc] = useState<Record<string, string>>({});
	const [visibleDiem, setVisibleDiem] = useState(false);
	// const { cctFilter } = useAccess();
	const [visibleChuongTrinh, setVisibleChuongTrinh] = useState(false);
	const isSongNganh = maKhoaNganh === khoaNganhMe?.khoaNganhPhu?.ma;
	const chuyenNganhHienTai = isSongNganh ? recSinhVien?.chuyenNganh2 : recSinhVien?.chuyenNganh;

	const getColorMap = (listKhoiHpCt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const listKhoi = _.uniq(listKhoiHpCt.map((item) => item.maKhoiKienThuc));
		const temp: Record<string, string> = {};
		listKhoi.forEach(
			(khoi) =>
				(temp[khoi as string] =
					`rgb(${Math.random() * 190 + 15}, ${Math.random() * 190 + 15}, ${Math.random() * 190 + 15})`),
		);
		setMapColorKhoiKienThuc(temp);
	};

	const fetch = async () => {
		await sinhVienGetTienTrinhKhungModel(isSongNganh).then((data) => {
			setRawData(data || []);
			getColorMap(data);
		});
	};

	const danhSachHienThi = useMemo(() => {
		if (!rawData?.length) return [];

		const isBlockView = viewType === 'block';
		const maChuyenNganhHienTai = isSongNganh ? recSinhVien?.maChuyenNganh2 : recSinhVien?.maChuyenNganh;
		const selectedPathwayIds: (string | undefined)[] = registeredPathway.map((p) => p.maKhoiKienThuc);
		if (maChuyenNganhHienTai) selectedPathwayIds.push(maChuyenNganhHienTai);

		// BƯỚC 1: Lọc cứng theo Chuyên ngành chính (Major Filter)
		// Loại bỏ các môn thuộc chuyên ngành khác ngay từ đầu
		const dataAfterMajorFilter = rawData.filter((item) => {
			if (!item.maChuyenNganh || !maChuyenNganhHienTai) return true;
			return item.maChuyenNganh === maChuyenNganhHienTai;
		});

		// BƯỚC 2: Lọc theo Lộ trình tự chọn (Elective Pathway Filter)
		// Tìm các khối (root) mà đã có lộ trình tự chọn được đăng ký
		const rootBlocksWithElectiveSelection = _.uniq(
			dataAfterMajorFilter
				.filter((item) => {
					// Chỉ xét các pathway tự chọn (không phải chuyên ngành chính)
					const isElectivePathway = !!item.khoiKienThuc?.maCha && !item.maChuyenNganh;
					return isElectivePathway && selectedPathwayIds.includes(item.maKhoiKienThuc);
				})
				.map((item) => item.khoiKienThuc?.maCha),
		);

		const filteredData = dataAfterMajorFilter.filter((item) => {
			const rootId = item.khoiKienThuc?.maCha;
			const pwId = item.maKhoiKienThuc;

			// Nếu đây là một pathway tự chọn trong một khối đã có lựa chọn
			if (rootId && rootBlocksWithElectiveSelection.includes(rootId)) {
				return selectedPathwayIds.includes(pwId);
			}

			return true;
		});

		if (!isBlockView) {
			const gData = _.groupBy(filteredData, (item) => item.soThuTuKy);
			const sortedEntries = Object.entries(gData).sort(([a], [b]) => Number(a) - Number(b));

			return sortedEntries.map(([key, group]) => {
				const uniqchuyenNganh = _.uniq(
					group.filter((item) => !!item.maChuyenNganh).map((item) => item.maChuyenNganh),
				);
				// Nếu đã có chuyên ngành hiện tại, coi như không phân chuyên ngành ở level này để đẩy lên grid chính
				const isFixedMajor = !!maChuyenNganhHienTai && uniqchuyenNganh.includes(maChuyenNganhHienTai);

				const khoiHocPhan = group.filter(
					(item) => !item.maChuyenNganh || isFixedMajor || uniqchuyenNganh.length < 2,
				);
				const da1 = group.filter(
					(item) =>
						!item.maChuyenNganh ||
						item.maChuyenNganh === maChuyenNganhHienTai ||
						item.maChuyenNganh === uniqchuyenNganh?.[0],
				);
				const soTinChiPhaiHoc = _.sumBy(da1, (item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0);
				const soTinChiTuChon = _.sumBy(da1, (item) => item.soTinChiTuChonPhaiHoc || 0);

				const chuyenNganh = group.filter(
					(item) => !!item.maChuyenNganh && !isFixedMajor && uniqchuyenNganh.length >= 2,
				);
				const chuyenNganhList = Object.values(_.groupBy(chuyenNganh, (item) => item.maChuyenNganh)).map(
					(item) => ({
						khoiHocPhan: item,
						tenPathway: undefined as string | undefined,
						maPathway: item[0].maChuyenNganh,
					}),
				);

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
		const gData = _.groupBy(filteredData, (item) => item.khoiKienThuc?.maCha || item.maKhoiKienThuc);
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

			// Tối ưu hóa: Tách nhóm bằng partition (Grid chính vs Lộ trình tự chọn)
			const [khoiHocPhan, electivePathways] = _.partition(group, (item) => {
				const isElectivePathway = !!item.khoiKienThuc?.maCha && !item.maChuyenNganh;
				return !isElectivePathway || selectedPathwayIds.includes(item.maKhoiKienThuc);
			});

			const pathwayGroups = _.groupBy(
				electivePathways.filter((it) => !selectedPathwayIds.includes(it.maKhoiKienThuc)),
				(it) => it.maKhoiKienThuc,
			);

			// Tín chỉ dự kiến: Grid chính + (Pathway đầu tiên nếu có)
			const firstPathwayId = Object.keys(pathwayGroups)?.[0];
			const coursesForTotal = [
				...khoiHocPhan,
				...electivePathways.filter((it) => it.maKhoiKienThuc === firstPathwayId),
			];

			const soTinChiPhaiHoc = _.sumBy(
				coursesForTotal,
				(item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0,
			);

			const chuyenNganhList = Object.entries(pathwayGroups).map(([pwId, items]) => ({
				khoiHocPhan: items,
				// Tên pathway: Ưu tiên tên chuyên ngành, sau đó đến tên khối con
				tenPathway: items[0].chuyenNganh?.ten || items[0].khoiKienThuc?.ten,
				maPathway: pwId,
			}));

			return {
				khoiHocPhan,
				soTinChiPhaiHoc,
				soTinChiTuChon: undefined as number | undefined,
				chuyenNganhList,
				soThuTuKy: undefined as number | undefined,
				maKhoiKienThuc: rootId,
				tenKhoiKienThuc,
				// Thống kê môn học (Dùng so sánh chuỗi hoặc Enum nếu có)
				soMonDaHoc: group.filter((item) => item.hoc === ('DA_HOC' as any) || item.hoc === ('DANG_HOC' as any)).length,
				tongSoMon: group.length,
			};
		});
	}, [rawData, viewType]);

	useEffect(() => {
		fetch();
	}, [maKhoaNganh]);

	const renderHocPhan = (
		data: TChuongTrinhHocKy | { khoiHocPhan: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[] },
		getLabel?: (item: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => string | undefined,
	) => (
		<div className='grid-container'>
			{data.khoiHocPhan.map((ctk) =>
				ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
					<CardHocPhanV2
						key={ctk._id}
						hocPhan={ctk.hocPhan}
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
						onClickHocPhan={() => setVisibleDiem(true)}
					/>
				),
			)}
		</div>
	);

	return (
		<div>
			<div className='view-switch-container'>
				<Segmented
					value={viewType}
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
			</div>

			<Spin spinning={loading}>
				{danhSachHienThi?.map((data, index) => (
					<React.Fragment key={viewType === 'semester' ? data.soThuTuKy : data.maKhoiKienThuc}>
							{/* Header học kỳ/Khối */}
						<Divider orientation='left' className='divider-big-title'>
								<div className='header-content'>
									<Title level={5} style={{ margin: 0, color: '#262626' }}>
										{viewType === 'semester'
											? `${intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hocky' })} ${data.soThuTuKy}`
											: data.tenKhoiKienThuc || intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khongten' })}
									</Title>
									<div className='red-dot' />
									<div className='credits-text'>
										{data.soTinChiPhaiHoc} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tinchi' })}
									</div>
									
									{/* Nhãn thống kê số môn (chỉ hiện ở chế độ Block) */}
									{viewType === 'block' && (
										<Tag color='blue' className='stats-tag'>
											{data.soMonDaHoc}/{data.tongSoMon} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.courses' })}
										</Tag>
									)}

								</div>
						</Divider>

						{/* Grid các môn học */}
						{renderHocPhan(data, (item) => {
							// 1. Ưu tiên nhãn Chuyên ngành/Chuyên ngành phụ nếu có
							if (item.chuyenNganh?.ten) {
								const isMinor = item.maChuyenNganh === recSinhVien?.maChuyenNganh2;
								const labelId = isMinor ? 'tientrinhhoctap.ctdt.chuyennganhphu.label' : 'tientrinhhoctap.ctdt.chuyennganh.label';
								return `${intl.formatMessage({ id: labelId })}: ${item.chuyenNganh.ten}`;
							}

							// 2. Nếu không có chuyên ngành, hiện nhãn Khối (thường dùng trong chế độ Học kỳ cho các môn tự chọn)
							if (viewType === 'semester' && item.khoiKienThuc?.ten) {
								return `${intl.formatMessage({ id: 'tientrinhhoctap.ctdt.pathway.label' })}: ${item.khoiKienThuc.ten}`;
							}

							return undefined;
						})}

						{data.chuyenNganhList?.length ? (
							<Collapse bordered={false} defaultActiveKey={[chuyenNganhHienTai?.ma ?? '']}>
								{data.chuyenNganhList.map((chuyenNganh, idx) => (
									<Collapse.Panel
										key={chuyenNganh.maPathway || chuyenNganh.khoiHocPhan[0].maChuyenNganh || chuyenNganh.khoiHocPhan[0].maKhoiKienThuc || ''}
										header={
											<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
												<span style={{ fontWeight: 500 }}>
													{viewType === 'semester' ? (
														intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' }) + ': '
													) : null}
													{chuyenNganh.tenPathway ?? chuyenNganh.khoiHocPhan[0].chuyenNganh?.ten ?? chuyenNganh.khoiHocPhan[0].maChuyenNganh}
												</span>
												{(registeredPathway.some((p) => p.maKhoiKienThuc === chuyenNganh.khoiHocPhan[0].maChuyenNganh) || 
												  registeredPathway.some((p) => p.maKhoiKienThuc === chuyenNganh.khoiHocPhan[0].maKhoiKienThuc)) && (
													<Tag color='success' style={{ marginLeft: 8 }}>
														{intl.formatMessage({ id: 'pathway.card.selected' })}
													</Tag>
												)}
											</div>
										}
									>
										{renderHocPhan(chuyenNganh, (item) => {
											if (viewType === 'semester') return undefined; // Trong Collapse học kỳ thì không cần label nữa vì đã có Header

											// Logic tương tự Grid chính để hiển thị nhãn Chuyên ngành/Phụ
											if (item.chuyenNganh?.ten) {
												const isMinor = item.maChuyenNganh === recSinhVien?.maChuyenNganh2;
												const labelId = isMinor ? 'tientrinhhoctap.ctdt.chuyennganhphu.label' : 'tientrinhhoctap.ctdt.chuyennganh.label';
												return `${intl.formatMessage({ id: labelId })}: ${item.chuyenNganh.ten}`;
											}

											return undefined;
										})}
									</Collapse.Panel>
								))}
							</Collapse>
						) : null}

					</React.Fragment>
				))}
			</Spin>

			<ModalChiTietDiem
				setVisible={setVisibleDiem}
				visible={visibleDiem}
				hocPhan={recChuongTrinh?.hocPhan}
				listDiem={recChuongTrinh?.lichSuDiem ?? []}
				maKhoaNganh={maKhoaNganh}
				khoiChuongTrinh={recChuongTrinh}
				colorKhoiKienThuc={
					recChuongTrinh?.maKhoiKienThuc ? mapColorKhoiKienThuc[recChuongTrinh.maKhoiKienThuc] : undefined
				}
				trangThaiHoc={recChuongTrinh?.hoc}
			/>

			<ChuongTrinhDaoTaoModalView visible={visibleChuongTrinh} setVisible={setVisibleChuongTrinh} />
		</div>
	);
};

export default TienTrinhChuongTrinhKhung;
