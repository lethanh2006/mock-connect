import ModalKhaoSatBatBuoc from '@/pages/TienIch/KhaoSat/components/ModalKhaoSatBatBuoc';
import { landingUrl } from '@/services/base/constant';
import { FileWordOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Menu, Modal, Row, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useIntl, useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';
import { ELoaiDot } from '@/services/TienIch/KhaoSat/constants';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { getDotMeModel, setVisibleKhaoSatBatBuoc, setRecord, setDsKhaoSatBatBuoc } = useModel('tienich.dotkhaosat');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const avatarUrl = recSinhVien?.anhDaiDienUrl ?? initialState?.currentUser?.picture;

	const handleCheckKhaoSatBatBuoc = async () => {
		try {
			const res = await getDotMeModel(ELoaiDot.BIEU_MAU);
			const index = res?.filter((item) => item?.defaultOpenAuth && !item?.daLam);
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
										Thời gian diễn ra từ {moment(index?.[0]?.thoiGianBatDau).format('DD/MM')} đến{' '}
										{moment(index?.[0]?.thoiGianKetThuc).format('DD/MM/YYYY')}.
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
		: initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || '');
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const items: ItemType[] = [
		{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
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
				APP_CONFIG_TITLE_LANDING ?? intl.formatMessage({ id: 'app.header.portal', defaultMessage: 'Cổng thông tin' }),
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

	if (!initialState.currentUser.realm_access?.roles?.includes('QUAN_TRI_VIEN')) {
		items.splice(0, 1, {
			key: 'center',
			icon: <UserOutlined />,
			label: fullName
				? `${fullName} - ${initialState.currentUser?.preferred_username || ''}`
				: initialState.currentUser?.preferred_username || '',
			onClick: () => history.push('/thong-tin-ca-nhan'),
		});
	}

	return (
		<>
			<HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar
						className={styles.avatar}
						src={!!avatarUrl ? <img src={avatarUrl} /> : undefined}
						icon={!avatarUrl ? lastNameChar ?? <UserOutlined /> : undefined}
						alt='avatar'
					/>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</HeaderDropdown>

			<ModalKhaoSatBatBuoc />
		</>
	);
};

export default AvatarDropdown;
