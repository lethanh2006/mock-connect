import {
	colorTrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
	type ETrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorHinhThucGiangDay, type EHinhThucGiangDay } from '@/services/HocTap/constant';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { colorTrangThaiThi } from '@/services/KhaoThi/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Dropdown, Modal, Popconfirm, Space, Tag, message } from 'antd';
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

	const handleMoodle = (lopHocPhanId?: string) => {
		if (lopHocPhanId)
			getMoodleLopHocPhanModel(lopHocPhanId).then((data) => {
				if (data?.url) window.open(`${data.url}`);
				else message.error('Có lỗi, vui lòng thử lại sau');
			});
	};

	// Default config for unmatched event types
	const defaultEventConfig: EventTypeConfig = {
		type: ELoaiSuKien.CA_NHAN,
		checker: () => true,
		renderer: (evt) => (
			<>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tensukien' })}>
					{evt?.tenSuKien}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
					{dayjs(evt?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
					{dayjs(evt?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
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
							{dayjs(thoiKhoaBieu?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
							{dayjs(thoiKhoaBieu?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
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
						{thoiKhoaBieu?.lopHocPhan?.lmsUrl ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.hoctructuyen' })}>
								<a href={thoiKhoaBieu?.lopHocPhan?.lmsUrl} target='_blank' rel='noreferrer'>
									{intl.formatMessage({ id: 'lichsukien.chitiet.duongdan' })}
								</a>
							</Descriptions.Item>
						) : null}
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.hinhthuc' })}>
							<Tag color={colorHinhThucGiangDay[thoiKhoaBieu?.hinhThucGiangDay as EHinhThucGiangDay]}>
								{thoiKhoaBieu?.hinhThucGiangDay}
							</Tag>
						</Descriptions.Item>
					</>
				);
			},
			actionButtons: (evt) => [
				<Dropdown.Button
					key='actions'
					type='primary'
					menu={{
						items: [
							{
								key: 'thong-bao',
								label: intl.formatMessage({ id: 'lichsukien.chitiet.thongbao' }),
								onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}#thong-bao`),
							},
							{
								key: 'dien-dan',
								label: intl.formatMessage({ id: 'lichsukien.chitiet.diendan' }),
								onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}#dien-dan`),
							},
							{
								key: 'bai-tap',
								label: intl.formatMessage({ id: 'lichsukien.chitiet.baitap' }),
								onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}#bai-tap`),
							},
						],
					}}
					onClick={() => history.push(`/hoc-tap/lop-tin-chi/${evt?.lopHocPhan?._id}`)}
				>
					{intl.formatMessage({ id: 'lichsukien.chitiet.xemchitiet' })}
				</Dropdown.Button>,
			],
		},
		{
			type: ELoaiSuKien.LICH_THI,
			checker: (evt) => evt.loaiSuKien === ELoaiSuKien.LICH_THI,
			renderer: (evt) => {
				const lichThi = evt as LichThi.IRecord;
				return (
					<>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.monthi' })}>
							{lichThi?.danhSachHocPhan?.map((item) => `${item.ma} - ${item.ten}`).join(', ')}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
							{dayjs(lichThi?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.phongthi' })}>
							{lichThi?.phong?.ma ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.dieukien' })}>
							{lichThi?.trangThai ? <Tag color={colorTrangThaiThi[lichThi.trangThai]}>{lichThi.trangThai}</Tag> : '--'}
						</Descriptions.Item>
					</>
				);
			},
			actionButtons: (evt) => [
				<Button key='exam-schedule' type='primary' onClick={() => history.push('/hoc-tap/lich-thi')}>
					{intl.formatMessage({ id: 'lichsukien.chitiet.xemlichthi' })}
				</Button>,
			],
		},
		{
			type: ELoaiSuKien.BAI_TAP,
			checker: (evt) => evt.loaiSuKien === ELoaiSuKien.BAI_TAP,
			renderer: (evt) => (
				<>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tenbaitap' })}>
						{evt?.assignment?.noiDung ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.loptinchi' })}>
						{evt?.assignment?.tenLopHocPhan ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.giangvien' })}>
						{evt?.assignment?.hoTenNguoiGiao ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tggiaobai' })}>
						{evt?.assignment?.createdAt ? dayjs(evt?.assignment?.createdAt).format('HH:mm DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.thoihan' })}>
						{evt?.assignment?.thoiGianKetThuc
							? dayjs(evt?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
							: '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.trangthai' })}>
						<Tag color={colorTrangThaiNopBaiTap[evt.trangThai as ETrangThaiNopBaiTap]}>
							{mapTrangThaiNopBaiTap[evt.trangThai as ETrangThaiNopBaiTap]}
						</Tag>
					</Descriptions.Item>
				</>
			),
			actionButtons: (evt) => [
				<Dropdown.Button
					key='actions'
					type='primary'
					menu={{
						items: [
							{
								key: 'thong-bao',
								label: intl.formatMessage({ id: 'lichsukien.chitiet.thongbao' }),
								onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}#thong-bao`),
							},
							{
								key: 'dien-dan',
								label: intl.formatMessage({ id: 'lichsukien.chitiet.diendan' }),
								onClick: () => history.push(`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}#dien-dan`),
							},
							{
								key: 'bai-tap',
								label: intl.formatMessage({ id: 'lichsukien.chitiet.baitap' }),
								onClick: () =>
									history.push(
										`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}?idBaiTap=${evt?.assignment?._id}#bai-tap`,
									),
							},
						],
					}}
					onClick={() =>
						history.push(
							`/hoc-tap/lop-tin-chi/${evt?.assignment?.lopHocPhanId}?idBaiTap=${evt?.assignment?._id}#bai-tap`,
						)
					}
				>
					{intl.formatMessage({ id: 'lichsukien.chitiet.xemchitiet' })}
				</Dropdown.Button>,
			],
		},
		{
			type: ELoaiSuKien.CA_NHAN,
			checker: (evt) => evt.loaiSuKien === ELoaiSuKien.CA_NHAN,
			renderer: (evt) => (
				<>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tensukien' })}>
						{evt?.tenSuKien}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgbt' })}>
						{dayjs(evt?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.tgkt' })}>
						{dayjs(evt?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.diadiem' })}>
						{evt?.diaDiem ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.ghichu' })}>
						{evt?.ghiChu ?? '--'}
					</Descriptions.Item>
				</>
			),
			actionButtons: (evt) => [
				<Button
					key='edit'
					type='primary'
					onClick={() => {
						handleEdit(evt);
						setVisible(false);
					}}
					icon={<EditOutlined />}
				>
					{intl.formatMessage({ id: 'lichsukien.chitiet.chinhsua' })}
				</Button>,
				<Popconfirm
					key='delete'
					title={intl.formatMessage({ id: 'lichsukien.chitiet.xoa.xacnhan' })}
					onConfirm={() => {
						deleteModel(evt?._id ?? '', getData);
						setVisible(false);
					}}
				>
					<Button danger icon={<DeleteOutlined />}>
						{intl.formatMessage({ id: 'lichsukien.chitiet.xoa' })}
					</Button>
				</Popconfirm>,
			],
		},
	];

	// Find the appropriate config for current event
	const getCurrentEventConfig = (): EventTypeConfig => {
		return eventConfigs.find((config) => config.checker(event)) || defaultEventConfig;
	};

	const currentConfig = getCurrentEventConfig();

	// Render event type tag
	const renderEventTypeTag = () => (
		<Descriptions.Item label={intl.formatMessage({ id: 'lichsukien.chitiet.loai' })}>
			{loaiSuKien ? <Tag color={getColorSuKien(loaiSuKien)}>{loaiSuKien}</Tag> : '--'}
		</Descriptions.Item>
	);

	// Render action buttons
	const renderActionButtons = () => {
		const buttons: JSX.Element[] = [];

		if (currentConfig?.actionButtons) {
			buttons.push(
				...currentConfig.actionButtons(event, {
					deleteModel,
					handleEdit,
					getData,
					setVisible,
					history,
				}),
			);
		}

		buttons.push(
			<Button key='close' onClick={() => setVisible(false)}>
				{intl.formatMessage({ id: 'global.button.dong' })}
			</Button>,
		);

		return buttons;
	};

	return (
		<Modal
			open={visible}
			title={intl.formatMessage({ id: 'lichsukien.chitiet.title' })}
			destroyOnClose
			width={600}
			onCancel={() => setVisible(false)}
			footer={<Space wrap>{renderActionButtons()}</Space>}
		>
			<Descriptions column={1}>
				{renderEventTypeTag()}
				{currentConfig?.renderer(event)}
			</Descriptions>
		</Modal>
	);
};

export default ModalViewDetailCalendar;
