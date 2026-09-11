import { TabViewPage } from '@/components/TabViewPage';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { AppModules, ESettingKey } from '@/services/base/constant';
import { currentRole, ipDaoTao } from '@/utils/ip';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Row, Tabs } from 'antd';
import { IconCalendar, IconShieldInfo } from '@/components/Icons';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { history, useAccess, useIntl, useModel, useParams } from 'umi';
import DanhSachGiangVien from './components/DanhSachGiangVien';
import DanhSachSinhVien from './components/DanhSachSinhVien';
import SelectLopHocPhanBreadcrumb from './components/SelectLopHocPhanBreadcrumb';
import './components/style.less';
import ThongTinChung from './components/ThongTinChung';
import ThongTinChungHeaderCard from './components/ThongTinChungHeaderCard';
import DanhSachBuoiHoc from './LichHoc';

const DetailLopTinChi = () => {
	const intl = useIntl();
	const { id } = useParams<{ id: string }>();
	const { record: recHocKy, getModel: getHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord, loading } = useModel('lophocphan.lophocphan');
	const { settings, getByKeyModel: getSettings } = useModel('tienich.caidat');
	const {
		record: recLopThucHanh,
		danhSach: danhSachLopThucHanh,
		sinhVienGetByIdModel: getByIdLopThucHanh,
		sinhVienGetModel: getLopThucHanh,
		danhSachNhanSu: danhSachNhanSuLopTH,
		getAllNhanSuModel: getNhanSuLopTH,
		loading: loadingThucHanh,
	} = useModel('daotao.lopthuchanh');
	const [activeKey, setActiveKey] = useState<string>('-1');
	const auth = useAuth();
	const { cctFilter } = useAccess();

	const paths = [
		'thong-tin',
		'buoi-hoc',
		'thong-bao',
		'dien-dan',
		'lms',
		'bai-tap',
		'ket-qua',
		'danh-gia-giang-vien',
		'syllabus',
	];
	const titles = [
		intl.formatMessage({ id: 'lophocphan.id.thongtinchung' }),
		intl.formatMessage({ id: 'lophocphan.id.lichhoc' }),
		intl.formatMessage({ id: 'lophocphan.id.thongbao' }),
		intl.formatMessage({ id: 'lophocphan.id.diendan' }),
		intl.formatMessage({ id: 'lophocphan.id.lms' }),
		intl.formatMessage({ id: 'lophocphan.id.baitap' }),
		intl.formatMessage({ id: 'lophocphan.id.ketqua' }),
		intl.formatMessage({ id: 'lophocphan.id.khaosat' }),
		intl.formatMessage({ id: 'lophocphan.id.syllabus' }),
	];
	const [visibleDeCuongHp, setVisibleDeCuongHp] = useState<[boolean, string]>([false, '3']);
	const [activeTabTitle, setActiveTabTitle] = useState(titles[0]);

	useEffect(() => {
		const updateTabFromHash = () => {
			const currentHash = window.location.hash.replace('#', '');
			const index = currentHash ? paths.indexOf(currentHash) : 0;
			setActiveTabTitle(titles[index >= 0 ? index : 0]);
		};

		updateTabFromHash();
		window.addEventListener('hashchange', updateTabFromHash);

		return () => {
			window.removeEventListener('hashchange', updateTabFromHash);
		};
	}, []);

	useEffect(() => {
		document.title = [record?.ten, intl.formatMessage({ id: AppModules[currentRole].title })]
			.filter(Boolean)
			.join(' - ');
	}, [record?.ten]);

	useEffect(() => {
		getSettings(ESettingKey.GENERAL_INFO, ipDaoTao);
	}, []);

	const getData = () => {
		if (id) {
			sinhVienGetByIdModel(id)
				.then((rec) => {
					if (rec.parent?._id) history.replace(`/hoc-tap/lop-tin-chi/${rec.parent._id}${window.location.hash}`);
					else if (!recHocKy?._id) getHocKy({ ma: rec?.maHocKy });
				})
				.catch((er) => {
					history.push('/hoc-tap/lop-tin-chi');
				});
		}
	};

	useEffect(() => {
		if (auth.user?.access_token && id) {
			getData();
		}

		return () => {
			setRecord(undefined);
		};
	}, [auth.user?.access_token, id]);

	useEffect(() => {
		if (auth.user?.access_token) {
			const path = window.location.pathname;
			// Nếu là link lấy từ giảng viên thì chuyển đến đúng link của sinh viên
			if (path.startsWith('/giang-day/lop-tin-chi/')) {
				window.history.replaceState(
					{},
					document.title,
					`/hoc-tap/lop-tin-chi/${id}${window.location.search}${window.location.hash}`,
				);
			} else getData();
		}

		return () => {
			setRecord(undefined);
		};
	}, [auth.user?.access_token, id]);

	// Thêm useEffect để lấy dữ liệu nhóm thực hành
	useEffect(() => {
		setActiveKey('-1');
		if (record?._id) {
			getLopThucHanh({ tenCha: record?.ten });
		}
	}, [record?._id]);

	useEffect(() => {
		if (activeKey !== '-1') {
			getByIdLopThucHanh(activeKey);
			getNhanSuLopTH(activeKey);
		}
	}, [activeKey]);

	const menus = [
		{
			title: titles[0],
			menuKey: paths[0],
			content: (
				<Row gutter={[16, 16]}>
					<Col span={24} md={{ span: 16 }} xxl={{ span: 18 }}>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<ThongTinChung onShowDeCuong={(tab) => setVisibleDeCuongHp([true, tab])} />
							</Col>
							{/* <Col span={24} lg={12}>
								<CardBaiTapLopHp lopHocPhanId={record?._id ?? ''} />
							</Col>
							<Col span={24} lg={12}>
								<CardThongBao
									loai='lop-hoc-phan'
									idLop={record?._id}
									onShowAll={() => (window.location.hash = 'thong-bao')}
								/>
							</Col> */}
						</Row>
					</Col>
					<Col span={24} md={{ span: 8 }} xxl={{ span: 6 }}>
						<Card variant='borderless' styles={{ body: { paddingTop: 0 } }}>
							<Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
								<Tabs.TabPane
									tab={`${intl.formatMessage({ id: 'lophocphan.id.thongtinchung.dssv' })} (${record?.sinhVienList?.length ?? 0})`}
									key='-1'
								/>
								{danhSachLopThucHanh?.map((item) => (
									<Tabs.TabPane
										tab={intl.formatMessage(
											{ id: 'lophocphan.id.thongtinchung.nhom' },
											{ loai: item.loai, soThuTuNhom: item.soThuTuNhom },
										)}
										key={item._id}
									/>
								))}
							</Tabs>

							{activeKey !== '-1' ? <DanhSachGiangVien danhSachNhanSu={danhSachNhanSuLopTH} /> : null}

							<DanhSachSinhVien
								sinhVienList={activeKey !== '-1' ? (recLopThucHanh?.sinhVienList ?? []) : (record?.sinhVienList ?? [])}
								loading={loading || loadingThucHanh}
								fromLopHocPhan
							/>
						</Card>
					</Col>
				</Row>
			),
			icon: <IconShieldInfo />,
		},

		// {
		// 	title: titles[8],
		// 	menuKey: paths[8],
		// 	content: <SyllabusPage lopHocPhanId={id as string} />,
		// 	icon: <BookOutlined />,
		// 	hide: !cctFilter?.(),
		// },

		{
			title: titles[1],
			menuKey: paths[1],
			content: <DanhSachBuoiHoc />,
			icon: <IconCalendar />,
		},
		// {
		// 	title: titles[2],
		// 	menuKey: paths[2],
		// 	content: (
		// 		<Card variant='borderless'>
		// 			<ThongBaoLopPage loai='lop-hoc-phan' idLop={id as string} />
		// 		</Card>
		// 	),
		// 	icon: <BellOutlined />,
		// },

		// {
		// 	title: titles[3],
		// 	menuKey: paths[3],
		// 	content: <DienDan idLopHocPhan={record?._id ?? (id as string)} />,
		// 	icon: <MessageOutlined />,
		// },

		// {
		// 	title: titles[4],
		// 	menuKey: paths[4],
		// 	content: <LmsOdooPage idLopHocPhan={id as string} />,
		// 	hide: !(settings?.GENERAL_INFO?.lmsMode === 'odoo' && record?.syncLms),
		// 	icon: <LaptopOutlined />,
		// },

		// {
		// 	title: titles[5],
		// 	menuKey: paths[5],
		// 	content: <BaiTapPage lopHocPhanId={id as string} />,
		// 	icon: <FileTextOutlined />,
		// },
		// {
		// 	title: titles[6],
		// 	menuKey: paths[6],
		// 	content: (
		// 		<Card variant='borderless' style={{ maxWidth: 1000, margin: 'auto' }}>
		// 			<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm học phần</h4>
		// 			<DetailKetQuaHocTap
		// 				lopHocPhanId={record?._id}
		// 				toDanhGiaGiangVien={() => (window.location.hash = 'danh-gia-giang-vien')}
		// 			/>
		// 		</Card>
		// 	),
		// 	icon: <BarChartOutlined />,
		// },
		// {
		// 	title: titles[7],
		// 	menuKey: paths[7],
		// 	content: (
		// 		<Card variant='borderless'>
		// 			<DanhGiaGiangVienPage />
		// 		</Card>
		// 	),
		// 	icon: <StarOutlined />,
		// },
	];

	return (
		<Card
			className='card-borderless card-big-title has-indicator'
			variant='borderless'
			title={intl.formatMessage({ id: 'lophocphan.id.title' })}
			extra={
				<Breadcrumb
					className='lhp-detail-breadcrumb'
					items={[
						{
							title: (
								<a onClick={() => history.push('/hoc-tap/lop-tin-chi')}>
									{intl.formatMessage({ id: 'lophocphan.title' })}
								</a>
							),
						},
						{
							title: (
								<SelectLopHocPhanBreadcrumb
									value={record?._id || id}
									onChange={(lopId: string) => {
										if (lopId) history.push(`/hoc-tap/lop-tin-chi/${lopId}${window.location.hash}`);
									}}
								/>
							),
						},
						{
							title: activeTabTitle,
						},
					]}
				/>
			}
		>
			<ThongTinChungHeaderCard onShowDeCuong={() => setVisibleDeCuongHp([true, '0'])} />

			<TabViewPage offsetTop={64} hideCard menu={menus} tabType='line' />

			<ModalHocPhan
				visible={visibleDeCuongHp[0]}
				setVisible={() => setVisibleDeCuongHp([false, '0'])}
				title={`${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} ${record?.hocKy?.ten ? `- ${record?.hocKy?.ten ?? ''}` : ''}`}
				activeKey={visibleDeCuongHp[1]}
			/>
		</Card>
	);
};

export default DetailLopTinChi;
