import ExpandText from '@/components/ExpandText';
import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
	ELoaiGiaoDichVi,
	ETrangThaiYeuCauRutTien,
	colorLoaiGiaoDichVi,
	colorTrangThaiYeuCauRutTien,
	loaiGiaoDichViI18n,
	loaiGiaoDichViTangSoDu,
	trangThaiYeuCauRutTienDangXuLy,
	trangThaiYeuCauRutTienI18n,
} from '@/services/TaiChinh/Vi/constant';
import type { Vi } from '@/services/TaiChinh/Vi/typing';
import { formatDateTime } from '@/utils/formatDate';
import { inputFormat } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Alert, Tabs, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalYeuCauRutTien from './components/ModalYeuCauRutTien';
import ThongTinVi from './components/ThongTinVi';

type TTabKey = 'giao-dich' | 'yeu-cau-rut';

const ViSinhVienPage = () => {
	const intl = useIntl();
	const [activeKey, setActiveKey] = useState<TTabKey>('giao-dich');
	const [visibleYeuCau, setVisibleYeuCau] = useState<boolean>(false);
	const { getModel, page, limit, viCuaToi, getViCuaToiModel } = useModel('taichinh.vi');
	const { getDanhSachCuaToiModel, danhSach: danhSachYeuCau, loading: loadingYeuCau } = useModel('taichinh.viyeucaurut');

	const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');

	const getDataYeuCau = () => getDanhSachCuaToiModel().catch((er) => console.log(er));

	/** Gửi đơn xong backend khóa ví và trừ số dư nên phải nạp lại cả thông tin ví */
	const onGuiYeuCauThanhCong = () => {
		getDataYeuCau();
		getViCuaToiModel().catch((er) => console.log(er));
	};

	// Danh sách yêu cầu quyết định việc có cho gửi yêu cầu mới hay không nên phải nạp ngay, kể cả khi đang ở tab giao dịch
	useEffect(() => {
		getDataYeuCau();
	}, []);

	const soDu = viCuaToi?.soDu ?? 0;
	const dangCoYeuCau = danhSachYeuCau?.some((item) => trangThaiYeuCauRutTienDangXuLy.includes(item.trangThai));
	const viDongBang = viCuaToi?.active === false;
	const disableYeuCau = viDongBang || !!dangCoYeuCau || soDu <= 0;

	const lyDoKhongYeuCauDuoc = viDongBang
		? 'visinhvien.ruttien.disabled.dongbang'
		: dangCoYeuCau
			? 'visinhvien.ruttien.disabled.dangxuly'
			: soDu <= 0
				? 'visinhvien.ruttien.disabled.khongdusodu'
				: undefined;

	const columnsGiaoDich: IColumn<Vi.IGiaoDich>[] = [
		{
			title: intl.formatMessage({ id: 'visinhvien.column.thoigian' }),
			dataIndex: 'createdAt',
			width: 140,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.column.loaigiaodich' }),
			dataIndex: 'loaiGiaoDich',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiGiaoDichVi)?.map((val) => ({
				label: intl.formatMessage({ id: loaiGiaoDichViI18n[val] }),
				value: val,
			})),
			render: (val: ELoaiGiaoDichVi) =>
				val && (
					<Tag color={colorLoaiGiaoDichVi[val]}>
						{loaiGiaoDichViI18n[val] ? intl.formatMessage({ id: loaiGiaoDichViI18n[val] }) : val}
					</Tag>
				),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.column.noidung' }),
			dataIndex: 'noiDung',
			width: 200,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.column.sotien' }),
			dataIndex: 'soTien',
			width: 130,
			align: 'right',
			filterType: 'number',
			sortable: true,
			render: (val: number, rec) => {
				const tang = loaiGiaoDichViTangSoDu.includes(rec.loaiGiaoDich);
				return (
					<Typography.Text type={tang ? 'success' : 'danger'} strong>
						{tang ? '+' : '-'}
						{inputFormat(val ?? 0)} VND
					</Typography.Text>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.column.sodutruoc' }),
			dataIndex: 'soDuTruoc',
			width: 130,
			align: 'right',
			filterType: 'number',
			render: (val) => `${inputFormat(val ?? 0)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.column.sodusau' }),
			dataIndex: 'soDuSau',
			width: 130,
			align: 'right',
			filterType: 'number',
			render: (val) => `${inputFormat(val ?? 0)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.column.nguoithuchien' }),
			dataIndex: 'createdByUsername',
			width: 160,
			filterType: 'string',
			render: (val) => val || '-',
		},
	];

	const columnsYeuCau: IColumn<Vi.IYeuCauRutTien>[] = [
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.ngaygui' }),
			dataIndex: 'createdAt',
			width: 160,
			align: 'center',
			sortable: true,
			render: (val) => val && formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.sotien' }),
			dataIndex: 'soTienRut',
			width: 200,
			align: 'right',
			sortable: true,
			render: (val) => `${inputFormat(val ?? 0)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.taikhoan' }),
			dataIndex: 'soTaiKhoanNganHang',
			width: 200,
			filterType: 'string',
			render: (val, rec) => (
				<>
					<div style={{ lineHeight: 1.3 }}>{val}</div>
					<Typography.Text type='secondary' style={{ fontSize: 12, lineHeight: 1.3 }}>
						{[rec.tenNganHang, rec.chiNhanhNganHang].filter(Boolean).join(' - ')}
					</Typography.Text>
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.sdt' }),
			dataIndex: 'soDienThoai',
			width: 150,
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.lydo' }),
			dataIndex: 'lyDoSinhVien',
			width: 220,
			filterType: 'string',
			render: (val: string) =>
				val && (
					<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2 }}>
						{val}
					</ExpandText>
				),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.trangthai' }),
			dataIndex: 'trangThai',
			width: 140,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiYeuCauRutTien)?.map((val) => ({
				label: intl.formatMessage({ id: trangThaiYeuCauRutTienI18n[val] }),
				value: val,
			})),
			render: (val: ETrangThaiYeuCauRutTien) =>
				val && (
					<Tag color={colorTrangThaiYeuCauRutTien[val]}>
						{trangThaiYeuCauRutTienI18n[val] ? intl.formatMessage({ id: trangThaiYeuCauRutTienI18n[val] }) : val}
					</Tag>
				),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.dachuyentien' }),
			dataIndex: 'isDaChuyenTien',
			width: 130,
			align: 'center',
			render: (val: boolean) => (
				<Tag color={val ? 'green' : 'default'}>
					{intl.formatMessage({
						id: val ? 'visinhvien.ruttien.dachuyentien.roi' : 'visinhvien.ruttien.dachuyentien.chua',
					})}
				</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.minhchung' }),
			dataIndex: 'minhChung',
			width: 120,
			align: 'center',
			render: (val: string) =>
				val ? (
					<Typography.Link href={val} target='_blank' rel='noreferrer'>
						{intl.formatMessage({ id: 'visinhvien.ruttien.column.minhchung.xem' })}
					</Typography.Link>
				) : null,
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.ruttien.column.ghichu' }),
			dataIndex: 'lyDo',
			width: 220,
			render: (val: string) =>
				val && (
					<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2 }}>
						{val}
					</ExpandText>
				),
		},
	];

	const buttonYeuCauRutTien = (
		<ButtonExtend
			key='yeu-cau-rut-tien'
			type='primary'
			icon={<ExportOutlined />}
			disabled={disableYeuCau}
			onClick={() => setVisibleYeuCau(true)}
		>
			{intl.formatMessage({ id: 'visinhvien.ruttien.button.yeucau' })}
		</ButtonExtend>
	);

	return (
		<PageCard title={intl.formatMessage({ id: 'visinhvien.title' })}>
			<ThongTinVi />

			{/* Nút yêu cầu bị disable nên lý do phải hiện ra ngoài, tooltip trên button disabled không trigger được */}
			{!!lyDoKhongYeuCauDuoc && (
				<Alert
					type='warning'
					showIcon
					style={{ marginBottom: 12 }}
					message={intl.formatMessage({ id: lyDoKhongYeuCauDuoc })}
				/>
			)}

			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab as TTabKey)}>
				<Tabs.TabPane key='giao-dich' tab={intl.formatMessage({ id: 'visinhvien.tab.giaodich' })} />
				<Tabs.TabPane key='yeu-cau-rut' tab={intl.formatMessage({ id: 'visinhvien.tab.yeucaurut' })} />
			</Tabs>

			{activeKey === 'giao-dich' ? (
				<TableBase
					buttons={{ create: false }}
					columns={columnsGiaoDich}
					getData={getData}
					dependencies={[page, limit]}
					modelName='taichinh.vi'
					otherButtons={[buttonYeuCauRutTien]}
				/>
			) : (
				// API `/yeu-cau-rut-tien/me` trả về toàn bộ đơn của sinh viên, không phân trang -> dùng table static
				<TableStaticData
					columns={columnsYeuCau}
					data={danhSachYeuCau}
					loading={loadingYeuCau}
					hasTotal
					onReload={getDataYeuCau}
					otherButtons={[buttonYeuCauRutTien]}
					otherProps={{ scroll: { x: 1200 } }}
				/>
			)}

			<ModalYeuCauRutTien visible={visibleYeuCau} setVisible={setVisibleYeuCau} getData={onGuiYeuCauThanhCong} />
		</PageCard>
	);
};

export default ViSinhVienPage;
