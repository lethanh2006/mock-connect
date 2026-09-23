import { Button } from '@/components/Icons';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { EVENT_TYPE_TAG, STATUS_TONE } from '@/services/Calendar/constant';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { mapHinhThucGiangDayI18n, type EHinhThucGiangDay } from '@/services/HocTap/constant';
import { ELoaiSuKien, ELoaiSuKienKhac, LoaiSuKienLocaleKey } from '@/services/SuKien/constant';
import { formatDateTime } from '@/utils/formatDate';
import { getSafeHref, openSafeUrl } from '@/utils/security';
import { toast } from '@/utils/toast';
import { Space } from 'antd';
import { JSX, type ReactNode } from 'react';
import { history, useIntl, useModel } from 'umi';
import './style.less';

const DetailView = ({ label, children }: { label: string; children?: ReactNode }) => (
	<div className='calendar-detail-view'>
		<div className='calendar-detail-view__label'>{label}</div>
		<div className='calendar-detail-view__value'>{children || '--'}</div>
	</div>
);

const DetailRow = ({ children }: { children: ReactNode }) => <div className='calendar-detail-row'>{children}</div>;

const StatusTag = ({ children, tone = 'success' }: { children: ReactNode; tone?: keyof typeof STATUS_TONE }) => (
	<span className='calendar-detail-status' style={STATUS_TONE[tone]}>
		{children}
	</span>
);

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

	const loaiSuKien = event?.loaiSuKien as ELoaiSuKien | ELoaiSuKienKhac;

	if (!event) return null;

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
				<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tensukien' })}>{evt?.tenSuKien}</DetailView>
				<DetailRow>
					<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
						{formatDateTime(evt?.thoiGianBatDau)}
					</DetailView>
					<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
						{formatDateTime(evt?.thoiGianKetThuc)}
					</DetailView>
				</DetailRow>
				<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.diadiem' })}>{evt?.diaDiem}</DetailView>
				<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.ghichu' })}>{evt?.ghiChu}</DetailView>
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
				const giangVien = thoiKhoaBieu?.giangVien?.ten
					? [thoiKhoaBieu.giangVien?.hoDem, thoiKhoaBieu.giangVien?.ten].join(' ')
					: thoiKhoaBieu?.tenNhanSu;
				const hinhThucGiangDay = thoiKhoaBieu?.hinhThucGiangDay as EHinhThucGiangDay | undefined;
				const hinhThucGiangDayLocaleKey = hinhThucGiangDay ? mapHinhThucGiangDayI18n[hinhThucGiangDay] : undefined;

				return (
					<>
						<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.loptinchi' })}>
							{thoiKhoaBieu?.tenLopHocPhan}
						</DetailView>
						<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tenhocphan' })}>
							{thoiKhoaBieu?.lopHocPhan?.hocPhan?.ten}
						</DetailView>
						<DetailRow>
							<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
								{formatDateTime(thoiKhoaBieu?.thoiGianBatDau)}
							</DetailView>
							<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
								{formatDateTime(thoiKhoaBieu?.thoiGianKetThuc)}
							</DetailView>
						</DetailRow>
						<DetailRow>
							<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.phonghoc' })}>
								{thoiKhoaBieu?.phongHoc}
							</DetailView>
							<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.giangvien' })}>{giangVien}</DetailView>
						</DetailRow>
						<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.tieude' })}>
							{thoiKhoaBieu?.tieuDeBaiHoc}
						</DetailView>
						{thoiKhoaBieu?.lopHocPhan?.moodleShortname ? (
							<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.lms' })}>
								<a onClick={() => handleMoodle(thoiKhoaBieu.lopHocPhan?._id)}>
									{intl.formatMessage({ id: 'lichsukien.chitiet.duongdan' })}
								</a>
							</DetailView>
						) : null}
						{getSafeHref(thoiKhoaBieu?.lopHocPhan?.lmsUrl) ? (
							<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.hoctructuyen' })}>
								<a href={getSafeHref(thoiKhoaBieu?.lopHocPhan?.lmsUrl)} target='_blank' rel='noreferrer'>
									{intl.formatMessage({ id: 'lichsukien.chitiet.duongdan' })}
								</a>
							</DetailView>
						) : null}
						<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.hinhthuc' })}>
							{hinhThucGiangDay ? (
								<StatusTag>
									{hinhThucGiangDayLocaleKey ? intl.formatMessage({ id: hinhThucGiangDayLocaleKey }) : hinhThucGiangDay}
								</StatusTag>
							) : null}
						</DetailView>
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
		<DetailView label={intl.formatMessage({ id: 'lichsukien.chitiet.loai' })}>
			{loaiSuKien ? (
				<span
					className='calendar-detail-tag'
					style={{ background: EVENT_TYPE_TAG[loaiSuKien] ?? 'rgba(19, 77, 139, 0.12)' }}
				>
					{getLoaiSuKienLabel(loaiSuKien)}
				</span>
			) : null}
		</DetailView>
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
			<Space wrap>
				<Button key='close' variant='outline' onClick={() => setVisible(false)}>
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
			width={720}
			onCancel={() => setVisible(false)}
			footer={renderActionButtons()}
			styles={{ body: { padding: 0 } }}
		>
			<div className='calendar-detail-body'>
				{renderEventTypeBadge()}
				{currentConfig?.renderer(event)}
			</div>
		</ModalExpandable>
	);
};

export default ModalViewDetailCalendar;
