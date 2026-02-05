import ModalKhaoSatBatBuoc from '@/pages/TienIch/KhaoSat/components/ModalKhaoSatBatBuoc';
import { landingUrl } from '@/services/base/constant';
import { ELoaiDot, EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { formatDate } from '@/utils/formatDate';
import { DatabaseOutlined, FileWordOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Modal, Row, Spin } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { rgba } from 'polished';
import { useEffect } from 'react';
import { history, useIntl, useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import { EOperatorType } from '../Table/constant';
import styles from './index.less';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { getModel, setVisibleKhaoSatBatBuoc, setRecord, setDsKhaoSatBatBuoc } = useModel('tienich.dotkhaosat');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach: dsPhanVung, getPartitionCodeMeModel } = useModel('core.phanvunguser');
	const { getAllModel: getAllPhanVung } = useModel('core.phanvungdulieu');

	const avatarUrl = recSinhVien?.anhDaiDienUrl ?? initialState?.currentUser?.picture;
	const currentPartition = localStorage.getItem('partitionCode');

	const handleCheckKhaoSatBatBuoc = async () => {
		try {
			//Get riêng để tránh xung đột danhSach khảo sát chung
			const res = await getModel(
				{ kichHoat: true },
				[
					{
						active: true,
						field: 'loai',
						operator: EOperatorType.EQUAL,
						values: [ELoaiDot.BIEU_MAU],
					},
				],
				{ updatedAt: -1 },
				undefined,
				undefined,
				'my/page',
				{ thoiGian: EThoiGianDot.DANG_DIEN_RA },
				false,
			);
			const index = res?.filter((item) => item?.kichHoat && item?.defaultOpenAuth && !item?.daLam);
			setDsKhaoSatBatBuoc(index);

			if (index?.length) {
				Modal.info({
					bodyStyle: { padding: 0 },
					icon: null,
					okButtonProps: { hidden: true },
					width: 600,
					keyboard: false,
					content: (
						<>
							<div>
								<img
									style={{ width: '100%', marginTop: -8, marginBottom: 12 }}
									src='/logi-thong-bao.png'
									alt={'image'}
								/>
							</div>

							<Row gutter={[12, 12]} style={{ textAlign: 'center' }}>
								<Col span={24}>
									<div style={{ color: '#1890ff', fontSize: 20, fontWeight: 600 }}>ĐỢT KHẢO SÁT ĐANG DIỄN RA</div>
								</Col>
								<Col span={24}>
									<div>Tên đợt: {index?.[0]?.ten}</div>
									<div>
										Thời gian diễn ra từ {formatDate(index?.[0]?.thoiGianBatDau, 'DD/MM')} đến{' '}
										{formatDate(index?.[0]?.thoiGianKetThuc)}.
									</div>
								</Col>
								<Col span={24}>
									<i>Vui lòng thực hiện hiện khảo sát trước khi sử dụng các dịch vụ khác!</i>
								</Col>
							</Row>

							<div className='form-footer'>
								<Button
									type={'primary'}
									onClick={() => {
										Modal.destroyAll();
										setRecord(index?.[0]);
										setVisibleKhaoSatBatBuoc(true);
									}}
								>
									Xem chi tiết
								</Button>
							</div>
						</>
					),
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (initialState?.currentUser?.ssoId) {
			getThongTinCuaToiModel().then((res) => {
				// if (res.needUpdateFaceReg)
				// 	notification.warn({
				// 		message: 'Nhận diện khuôn mặt',
				// 		description: 'Cần cập nhật ảnh nhận diện khuôn mặt',
				// 		key: 'updateFaceRegNoti',
				// 		btn: (
				// 			<Button
				// 				type='primary'
				// 				size='small'
				// 				onClick={() => {
				// 					history.push('/thong-tin-ca-nhan');
				// 					notification.close('updateFaceRegNoti');
				// 				}}
				// 			>
				// 				Cập nhật ngay
				// 			</Button>
				// 		),
				// 	});
			});

			handleCheckKhaoSatBatBuoc();

			//Get All phân vùng để lấy mã màu
			getAllPhanVung();
			getPartitionCodeMeModel(currentPartition?.toString());
		}
	}, [initialState?.currentUser?.ssoId]);

	const loginOut = () => OIDCBounder?.getActions()?.dangXuat();

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);

	const fullName = initialState.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || ''));
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const currentPartitionInfo = dsPhanVung?.find((item) => item?.dataPartitionCode === currentPartition);
	const currentPartitionColor = currentPartitionInfo?.dataPartition?.maMau;
	const currentPartitionName = currentPartitionInfo?.dataPartition?.name;

	const partitionItems: ItemType[] =
		dsPhanVung?.map((item) => {
			const code = item?.dataPartitionCode;
			const isActive = code === currentPartition;
			const partitionColor = item?.dataPartition?.maMau;

			const activeColor = partitionColor || 'var(--color-primary)';
			const activeBgColor = partitionColor ? rgba(partitionColor, 0.1) : 'var(--color-primary-bg)';

			return {
				key: `partition-${code}`,
				icon: <DatabaseOutlined />,
				label: item?.dataPartition?.name ?? item?.dataPartition?.ma,
				style: isActive
					? {
						backgroundColor: activeBgColor,
						borderLeft: `3px solid ${activeColor}`,
						color: activeColor,
						fontWeight: 'bold',
					}
					: undefined,
				onClick: () => {
					localStorage.setItem('partitionCode', code);
					window.location.reload();
				},
			};
		}) ?? [];

	const items: ItemType[] = [
		...(partitionItems as any),
		...(partitionItems.length > 0 ? [{ type: 'divider', key: 'divider' } as ItemType] : []),
		{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
			onClick: () => {
				if (!initialState?.currentUser?.realm_access?.roles?.includes('QUAN_TRI_VIEN')) {
					history.push('/thong-tin-ca-nhan');
				}
			},
		},
		// {
		// 	key: 'password',
		// 	icon: <SwapOutlined />,
		// 	label: 'Đổi mật khẩu',
		// 	onClick: () => {
		// 		const redirect = window.location.href;
		// 		window.location.href = `${keycloakAuthEndpoint}?client_id=${AppModules[currentRole].clientId}&redirect_uri=${redirect}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
		// 	},
		// },
		{
			key: 'office',
			icon: <FileWordOutlined />,
			label: 'Office 365',
			onClick: () => window.open('https://office.com/'),
		},
		{
			key: 'portal',
			icon: <GlobalOutlined />,
			label:
				`${intl.formatMessage({ id: `modules.cong-thong-tin` }) ?? intl.formatMessage({ id: 'app.header.portal', defaultMessage: 'Cổng thông tin' })}`,
			onClick: () => window.open(landingUrl),
		},
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: intl.formatMessage({ id: 'app.header.logout', defaultMessage: 'Đăng xuất' }),
			onClick: loginOut,
			danger: true,
		},
	];

	return (
		<>
			<Dropdown menu={{ items }}>
				<span className={`${styles.action} ${styles.account}`}>
					<div className={styles.avatarWrapper}>
						<Avatar
							className={styles.avatar}
							src={!!avatarUrl ? <img src={avatarUrl} /> : undefined}
							icon={!avatarUrl ? (lastNameChar ?? <UserOutlined />) : undefined}
							alt='avatar'
						/>
						{dsPhanVung?.length >= 2 && (
							<span
								className={styles.partitionBadge}
								style={{
									backgroundColor: currentPartitionColor || 'var(--color-primary)',
									color: '#fff',
								}}
							>
								{currentPartitionName?.[0]?.toUpperCase() ?? ''}
							</span>
						)}
					</div>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</Dropdown>

			<ModalKhaoSatBatBuoc />
		</>
	);
};

export default AvatarDropdown;
