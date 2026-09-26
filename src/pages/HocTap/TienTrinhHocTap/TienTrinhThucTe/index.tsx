import EmptyState from '@/components/EmptyState';
import { IconRotateArrow } from '@/components/Icons';
import VinSelect from '@/components/VinSelect';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Divider, Space, Spin, Tag, Typography } from 'antd';
import _ from 'lodash';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import '../ChuongTrinhKhung/style.less';
import CardHocPhanV2 from '../components/CardHocPhan';
import SearchTienTrinh from '../components/SearchTienTrinh';

const { Title } = Typography;

const GLOBAL_SEARCH_KEY = 'TIEN_TRINH_THUC_TE_SEARCH';

const matchTienTrinhItem = (item: ChuongTrinhDaoTao.TTienTrinhThucTe, keyword: string): boolean => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	if (!normalizedKeyword) return true;

	const searchableValues = [item.hocPhan?.ma, item.hocPhan?.ten, item.kyHoc?.ten, item.lopHocPhan?.ten];

	return searchableValues.some((value) => value?.toLowerCase().includes(normalizedKeyword));
};

const TienTrinhThucTeV2 = () => {
	const intl = useIntl();
	const { loading, sinhVienGetTienTrinhThucTeModel } = useModel('daotao.chuongtrinhdaotao');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const [tienTrinhHocKy, setTienTrinhHocKy] = useState<ChuongTrinhDaoTao.TTienTrinhThucTe[][]>();
	const [maHocKyFilter, setMaHocKyFilter] = useState<string>();
	const [searchText, setSearchText] = useState('');
	const [recTienTrinh, setRecTienTrinh] = useState<ChuongTrinhDaoTao.TTienTrinhThucTe>();
	const [visibleDiem, setVisibleDiem] = useState(false);

	const fetch = async () => {
		if (maKhoaNganh)
			sinhVienGetTienTrinhThucTeModel(maKhoaNganh).then((data) => {
				const gHocKy = Object.entries(_.groupBy(data, (item) => item.kyHoc?.ma));
				const dataHocKy = _.sortBy(gHocKy, ([ma]) => ma).reverse();
				setTienTrinhHocKy(dataHocKy.map(([, ds]) => ds));
			});
	};

	useEffect(() => {
		setMaHocKyFilter(undefined);
		fetch();
	}, [maKhoaNganh]);

	const hocKyOptions = useMemo(
		() =>
			(tienTrinhHocKy ?? [])
				.map((data) => ({
					label: data[0]?.kyHoc?.ten || data[0]?.kyHoc?.ma || '',
					value: data[0]?.kyHoc?.ma || '',
				}))
				.filter((item) => item.value),
		[tienTrinhHocKy],
	);

	const filteredTienTrinhHocKy = useMemo(() => {
		if (!maHocKyFilter) return tienTrinhHocKy;
		return tienTrinhHocKy?.filter((data) => data[0]?.kyHoc?.ma === maHocKyFilter);
	}, [tienTrinhHocKy, maHocKyFilter]);

	const displayedTienTrinhHocKy = useMemo(() => {
		if (!searchText.trim()) return filteredTienTrinhHocKy;

		return filteredTienTrinhHocKy
			?.map((data) => data.filter((item) => matchTienTrinhItem(item, searchText)))
			.filter((data) => data.length > 0);
	}, [filteredTienTrinhHocKy, searchText]);

	const renderKhoiKienThucLabel = (item: ChuongTrinhDaoTao.TTienTrinhThucTe) => {
		const isNgoaiCtdt = item.isNgoaiCtdt;
		const name = isNgoaiCtdt
			? intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.notApplied' })
			: item.khoiKienThuc?.ten;
		if (!name) return undefined;

		return (
			<>
				<span
					className='card-label-dot'
					style={{
						backgroundColor: isNgoaiCtdt ? '#ff4d4f' : `var(--color-primary)`,
					}}
				/>
				<span className='card-label-text' style={isNgoaiCtdt ? { color: '#ff4d4f' } : undefined}>
					{name}
				</span>
			</>
		);
	};

	return (
		<div>
			<div className='view-switch-container' style={{ marginBottom: 16 }}>
				<SearchTienTrinh storageKey={GLOBAL_SEARCH_KEY} value={searchText} onChange={setSearchText} />
				<Space>
					<ButtonExtend
						icon={<IconRotateArrow />}
						onClick={fetch}
						loading={loading}
						className='btn-reload'
						tooltip={intl.formatMessage({ id: 'global.table.index.button.tailai.tooltip' })}
					/>
					<VinSelect
						allowClear
						showSearch
						optionFilterProp='label'
						size='small'
						style={{ minWidth: 250, height: 36, fontWeight: 600 }}
						placeholder={intl.formatMessage({ id: 'tientrinhhoctap.filter.hocKy' })}
						value={maHocKyFilter ?? ''}
						onChange={(val) => setMaHocKyFilter(val || undefined)}
						options={[
							{
								label: intl.formatMessage({ id: 'tientrinhhoctap.filter.allHocKy' }),
								value: '',
							},
							...hocKyOptions,
						]}
					/>
				</Space>
			</div>

			<Spin spinning={loading}>
				{displayedTienTrinhHocKy?.length ? (
					displayedTienTrinhHocKy.map((data) => (
						<Fragment key={data[0]?.kyHoc?.ma ?? data[0]?.diemHpSvHk?._id}>
							<Divider orientation='left' className='divider-big-title' dashed>
								<div className='header-content'>
									<Title level={5} style={{ margin: 0, color: APP_CONFIG_PRIMARY_COLOR }}>
										{data[0].kyHoc?.ten}
									</Title>
									<Tag color='blue'>
										{_.sumBy(data, (i) => i.soTinChi ?? 0)} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tinchi' })}
									</Tag>
								</div>
							</Divider>

							<div className='grid-container'>
								{data.map((sv, index) => (
									<CardHocPhanV2
										key={sv.lichSuDiem?.[0]?._id}
										hocPhan={sv.hocPhan}
										onClick={() => {
											setRecTienTrinh(sv);
											setVisibleDiem(true);
										}}
										trangThaiHoc={sv.hoc}
										listDiem={sv.lichSuDiem}
										label={renderKhoiKienThucLabel(sv)}
									/>
								))}
							</div>
						</Fragment>
					))
				) : (
					<EmptyState
						description={intl.formatMessage({ id: 'tientrinhhoctap.empty' })}
						style={{
							marginTop: '100px',
							marginBottom: '32px',
							backgroundColor: '#fff',
							padding: '40px',
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
						}}
					/>
				)}
			</Spin>

			<ModalChiTietDiem
				setVisible={setVisibleDiem}
				visible={visibleDiem}
				hocPhan={recTienTrinh?.hocPhan}
				trangThaiHoc={recTienTrinh?.hoc}
				listDiem={recTienTrinh?.lichSuDiem ?? []}
				deCuongId={recTienTrinh?.lopHocPhan?.deCuong?.deCuongId}
				maKhoaNganh={maKhoaNganh}
				khoiChuongTrinh={
					recTienTrinh?.khoiKienThuc
						? {
								maKhoiKienThuc: recTienTrinh.maKhoiKienThuc ?? recTienTrinh.khoiKienThuc.ma,
								khoiKienThuc: recTienTrinh.khoiKienThuc,
							}
						: undefined
				}
			/>
		</div>
	);
};

export default TienTrinhThucTeV2;
