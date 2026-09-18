import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorHinhThucGiangDay, mapHinhThucGiangDayI18n, type EHinhThucGiangDay } from '@/services/HocTap/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac, LoaiSuKienLocaleKey } from '@/services/SuKien/constant';
import { formatDateTime } from '@/utils/formatDate';
import { getSafeHref, openSafeUrl } from '@/utils/security';
import { Descriptions, Modal, Space, Tag, message } from 'antd';
import { mapTrangThaiNopBaiTap, ETrangThaiNopBaiTap } from '@/services/DaoTao/BaiTap/constants';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { Button } from '@/components/Icons';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { toast } from '@/utils/toast';
import { JSX } from 'react';
import { history, useIntl, useModel } from 'umi';

// Configuration interface for event type handlers
interface EventTypeConfig {
	type: ELoaiSuKien | ELoaiSuKienKhac;
	checker: (event: any) => boolean;
	renderer: (event: any) => JSX.Element;
	actionButtons?: (event: any, handlers: any) => JSX.Element[];
}

const ModalViewDetailCalendar = (props: { visible: boolean; setVisible: any; event: any; getData: () => void }) => {
	const intl = useIntl();
	const { visible, setVisible, event, getData } = props;
	const { deleteModel, handleEdit } = useModel('sukien.sukien');
	const { getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
	const { record: recSetting } = useModel('tienich.settinglich');

	const loaiSuKien = event?.loaiSuKien as ELoaiSuKien | ELoaiSuKienKhac;

	if (!event) return null;

	const getColorSuKien = (loai: ELoaiSuKien | ELoaiSuKienKhac) => {
		return (
			recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === loai)?.maMau ?? ColorSuKien?.[loai] ?? '#ccc'
		);
	};

	const getLoaiSuKienLabel = (loai: ELoaiSuKien | ELoaiSuKienKhac) => {
		const localeKey = LoaiSuKienLocaleKey[loai];
		return localeKey ? intl.formatMessage({ id: localeKey }) : loai;
	};

	const handleMoodle = (lopHocPhanId?: string) => {
		if (lopHocPhanId)
			getMoodleLopHocPhanModel(lopHocPhanId).then((data) => {
				if (data?.url && openSafeUrl(data.url)) return;
				if (data?.url) toast.error(intl.formatMessage({ id: 'lichsukien.chitiet.duongdan.khonghople' }));
				else toast.error(intl.formatMessage({ id: 'lichsukien.chitiet.loi' }));
			});
	};

	// Default config for unmatched event types
	const defaultEventConfig: EventTypeConfig = {
		type: ELoaiSuKien.CHUNG,
		checker: () => true,
		renderer: (evt) => (
			<>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tensukien' })}>
					{evt?.tenSuKien}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
					{formatDateTime(evt?.thoiGianBatDau)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
					{formatDateTime(evt?.thoiGianKetThuc)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.diadiem' })}>
					{evt?.diaDiem ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.ghichu' })}>
					{evt?.ghiChu ?? '--'}
				</Descriptions.Item>
			</>
		),
	};

	// Event type configurations
	const eventConfigs: EventTypeConfig[] = [
		{
			type: ELoaiSuKien.LICH_HOC,
			checker: (evt) => evt.loaiSuKien === ELoaiSuKien.LICH_HOC,
			renderer: (evt) => {
				const thoiKhoaBieu = evt as ThoiKhoaBieu.IRecord;
				return (
					<>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.loptinchi' })}>
							{thoiKhoaBieu?.tenLopHocPhan}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tenhocphan' })}>
							{thoiKhoaBieu?.lopHocPhan?.hocPhan?.ten}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
							{formatDateTime(thoiKhoaBieu?.thoiGianBatDau)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
							{formatDateTime(thoiKhoaBieu?.thoiGianKetThuc)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.phonghoc' })}>
							{thoiKhoaBieu?.phongHoc ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.giangvien' })}>
							{thoiKhoaBieu?.giangVien?.ten
								? [thoiKhoaBieu.giangVien?.hoDem, thoiKhoaBieu.giangVien?.ten].join(' ')
								: (thoiKhoaBieu?.tenNhanSu ?? '--')}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tieude' })}>
							{thoiKhoaBieu?.tieuDeBaiHoc ?? '--'}
						</Descriptions.Item>
						{thoiKhoaBieu?.lopHocPhan?.moodleShortname ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.lms' })}>
								<a onClick={() => handleMoodle(thoiKhoaBieu.lopHocPhan?._id)}>
									{intl.formatMessage({ id: 'lichsukien.chitiet.duongdan' })}
								</a>
							</Descriptions.Item>
						) : null}
						{getSafeHref(thoiKhoaBieu?.lopHocPhan?.lmsUrl) ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.hoctructuyen' })}>
								<a href={getSafeHref(thoiKhoaBieu?.lopHocPhan?.lmsUrl)} target='_blank' rel='noreferrer'>
									{intl.formatMessage({ id: 'lichsukien.chitiet.duongdan' })}
								</a>
							</Descriptions.Item>
						) : null}
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.hinhthuc' })}>
							<Tag color={colorHinhThucGiangDay[thoiKhoaBieu?.hinhThucGiangDay as EHinhThucGiangDay]}>
								{intl.formatMessage({
									id: mapHinhThucGiangDayI18n[thoiKhoaBieu?.hinhThucGiangDay as EHinhThucGiangDay],
								})}
							</Tag>
						</Descriptions.Item>
					</>
				);
			},
			// actionButtons: (evt) => [
			// 	<Dropdown.Button
			// 		key='actions'
			// 		type='primary'
			// 		menu={{
			// 			items: [
			// 				{
			// 					key: 'thong-bao',
			// 					label: intl.formatMessage({ id: 'lichsukien.chitiet.thongbao' }),
			// 					onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}#thong-bao`),
			// 				},
			// 				{
			// 					key: 'dien-dan',
			// 					label: intl.formatMessage({ id: 'lichsukien.chitiet.diendan' }),
			// 					onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}#dien-dan`),
			// 				},
			// 				{
			// 					key: 'bai-tap',
			// 					label: intl.formatMessage({ id: 'lichsukien.chitiet.baitap' }),
			// 					onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}#bai-tap`),
			// 				},
			// 			],
			// 		}}
			// 		onClick={() => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}`)}
			// 	>
			// 		{intl.formatMessage({ id: 'lichsukien.chitiet.xemchitiet' })}
			// 	</Dropdown.Button>,
			// ],
		},
		{
			type: ELoaiSuKien.CHUNG,
			checker: (evt) => evt.isLichDktc,
			renderer: defaultEventConfig.renderer,
			actionButtons: () => [
				<Button
					key='course-registration'
					variant='default'
					onClick={() => {
						history.push('/hoc-tap/dang-ky-tin-chi');
					}}
				>
					{intl.formatMessage({ id: 'lichsukien.chitiet.dangky_tinchi' })}
				</Button>,
			],
		},
		// {
		// 	type: ELoaiSuKien.LICH_THI,
		// 	checker: (evt) => evt.loaiSuKien === ELoaiSuKien.LICH_THI,
		// 	renderer: (evt) => {
		// 		const lichThi = evt as LichThi.IRecord;
		// 		return (
		// 			<>
		// 				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.monthi' })}>
		// 					{lichThi?.danhSachHocPhan?.map((item) => `${item.ma} - ${item.ten}`).join(', ')}
		// 				</Descriptions.Item>
		// 				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
		// 					{formatDateTime(lichThi?.thoiGianBatDau)}
		// 				</Descriptions.Item>
		// 				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.phongthi' })}>
		// 					{lichThi?.phong?.ma ?? '--'}
		// 				</Descriptions.Item>
		// 				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.dieukien' })}>
		// 					{lichThi?.trangThai ? <Tag color={colorTrangThaiThi[lichThi.trangThai]}>{lichThi.trangThai}</Tag> : '--'}
		// 				</Descriptions.Item>
		// 			</>
		// 		);
		// 	},
		// 	actionButtons: (evt) => [
		// 		<Button key='exam-schedule' type='primary' onClick={() => history.push('/hoc-tap/lich-thi')}>
		// 			{intl.formatMessage({ id: 'lichsukien.chitiet.xemlichthi' })}
		// 		</Button>,
		// 	],
		// },
		// {
		// 	type: ELoaiSuKien.BAI_TAP,
		// 	checker: (evt) => evt.loaiSuKien === ELoaiSuKien.BAI_TAP,
		// 	renderer: (evt) => (
		// 		<>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tenbaitap' })}>
		// 				{evt?.assignment?.noiDung ?? '--'}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.loptinchi' })}>
		// 				{evt?.assignment?.tenLopHocPhan ?? '--'}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.giangvien' })}>
		// 				{evt?.assignment?.hoTenNguoiGiao ?? '--'}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tggiaobai' })}>
		// 				{evt?.assignment?.createdAt ? formatDateTime(evt?.assignment?.createdAt) : '--'}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.thoihan' })}>
		// 				{evt?.assignment?.thoiGianKetThuc
		// 					? formatDateTime(evt?.assignment?.thoiGianKetThuc)
		// 					: '--'}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.trangthai' })}>
		// 				<Tag color={colorTrangThaiNopBaiTap[evt.trangThai as ETrangThaiNopBaiTap]}>
		// 					{mapTrangThaiNopBaiTap[evt.trangThai as ETrangThaiNopBaiTap]}
		// 				</Tag>
		// 			</Descriptions.Item>
		// 		</>
		// 	),
		// 	actionButtons: (evt) => [
		// 		<Dropdown.Button
		// 			key='actions'
		// 			type='primary'
		// 			menu={{
		// 				items: [
		// 					{
		// 						key: 'thong-bao',
		// 						label: intl.formatMessage({ id: 'lichsukien.chitiet.thongbao' }),
		// 						onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}#thong-bao`),
		// 					},
		// 					{
		// 						key: 'dien-dan',
		// 						label: intl.formatMessage({ id: 'lichsukien.chitiet.diendan' }),
		// 						onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}#dien-dan`),
		// 					},
		// 					{
		// 						key: 'bai-tap',
		// 						label: intl.formatMessage({ id: 'lichsukien.chitiet.baitap' }),
		// 						onClick: () =>
		// 							history.push(
		// 								`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}?idBaiTap=${evt?.assignment?._id}#bai-tap`,
		// 							),
		// 					},
		// 				],
		// 			}}
		// 			onClick={() =>
		// 				history.push(
		// 					`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}?idBaiTap=${evt?.assignment?._id}#bai-tap`,
		// 				)
		// 			}
		// 		>
		// 			{intl.formatMessage({ id: 'lichsukien.chitiet.xemchitiet' })}
		// 		</Dropdown.Button>,
		// 	],
		// },
		// {
		// 	type: ELoaiSuKien.CA_NHAN,
		// 	checker: (evt) => evt.loaiSuKien === ELoaiSuKien.CA_NHAN,
		// 	renderer: (evt) => (
		// 		<>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tensukien' })}>
		// 				{evt?.tenSuKien}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
		// 				{formatDateTime(evt?.thoiGianBatDau)}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
		// 				{formatDateTime(evt?.thoiGianKetThuc)}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.diadiem' })}>
		// 				{evt?.diaDiem ?? '--'}
		// 			</Descriptions.Item>
		// 			<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.ghichu' })}>
		// 				{evt?.ghiChu ?? '--'}
		// 			</Descriptions.Item>
		// 		</>
		// 	),
		// 	actionButtons: (evt) => [
		// 		<Button
		// 			key='edit'
		// 			type='primary'
		// 			onClick={() => {
		// 				handleEdit(evt);
		// 				setVisible(false);
		// 			}}
		// 			icon={<EditOutlined />}
		// 		>
		// 			{intl.formatMessage({ id: 'lichsukien.chitiet.chinhsua' })}
		// 		</Button>,
		// 		<Popconfirm
		// 			key='delete'
		// 			title={intl.formatMessage({ id: 'lichsukien.chitiet.xoa.xacnhan' })}
		// 			onConfirm={() => {
		// 				deleteModel(evt?._id ?? '', getData);
		// 				setVisible(false);
		// 			}}
		// 		>
		// 			<Button danger icon={<DeleteOutlined />}>
		// 				{intl.formatMessage({ id: 'lichsukien.chitiet.xoa' })}
		// 			</Button>
		// 		</Popconfirm>,
		// 	],
		// },
	];

	// Find the appropriate config for current event
	const getCurrentEventConfig = (): EventTypeConfig => {
		return eventConfigs.find((config) => config.checker(event)) || defaultEventConfig;
	};

	const currentConfig = getCurrentEventConfig();

	// Render event type badge
	const renderEventTypeBadge = () => (
		<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.loai' })}>
			{loaiSuKien ? <Tag color={getColorSuKien(loaiSuKien)}>{getLoaiSuKienLabel(loaiSuKien)}</Tag> : '--'}
		</Descriptions.Item>
	);

	// Render action buttons
	const renderActionButtons = () => {
		const actionButtons: JSX.Element[] = [];

		if (currentConfig?.actionButtons) {
			actionButtons.push(
				...currentConfig.actionButtons(event, {
					deleteModel,
					handleEdit,
					getData,
					setVisible,
					history,
				}),
			);
		}

		return (
			<Space>
				<Button key='close' onClick={() => setVisible(false)}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
				{actionButtons}
			</Space>
		);
	};

	return (
		<ModalExpandable
			open={visible}
			title={intl.formatMessage({ id: 'lichsukien.chitiet.title' })}
			destroyOnClose
			width={600}
			onCancel={() => setVisible(false)}
			footer={renderActionButtons()}
		>
			<Descriptions column={1}>
				{renderEventTypeBadge()}
				{currentConfig?.renderer(event)}
			</Descriptions>
		</ModalExpandable>
	);
};

export default ModalViewDetailCalendar;
