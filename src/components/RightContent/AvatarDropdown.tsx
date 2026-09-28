import {
	AccountMenu,
	AccountMenuItem,
	AccountMenuOptions,
	AccountMenuSeparator,
	AccountMenuTrigger,
	IconCheck,
	IconDoor01,
	IconEarth,
	IconLogoMicrosoft,
} from '@/components/Icons';
import { AppModules, landingUrl } from '@/services/base/constant';
import { ELoaiDot, EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { formatDate } from '@/utils/formatDate';
import { generateInitialsAvatar } from '@/utils/initialsAvatar';
import { currentRole } from '@/utils/ip';
import { getPublicAssetPath } from '@/utils/path';
import { Button, Col, Modal, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import { EOperatorType } from '../Table/constant';
import './index.less';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { getModel, setVisibleKhaoSatBatBuoc, setRecord, setDsKhaoSatBatBuoc } = useModel('tienich.dotkhaosat');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach: dsPhanVung, getPartitionCodeMeModel } = useModel('core.phanvunguser');
	const { getAllModel: getAllPhanVung } = useModel('core.phanvungdulieu');
	const { getByIdModel: getSuKien } = useModel('cct.activityoutcome');
	const [visibleOutCome, setVisibleOutCome] = useState<boolean>(false);

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
									src={getPublicAssetPath('logi-thong-bao.png')}
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

	const getSuKienModel = () => {
		getSuKien('due', true).then((res) => {
			if (res?._id) {
				setVisibleOutCome(true);
			}
		});
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
			// handleCheckKhaoSatBatBuoc();
			// getSuKienModel();
			//Get All phân vùng để lấy mã màu
			// getAllPhanVung();
			// getPartitionCodeMeModel(currentPartition?.toString());
		}
	}, [initialState?.currentUser?.ssoId]);

	const loginOut = () => OIDCBounder?.getActions()?.dangXuat();

	if (!initialState || !initialState.currentUser) {
		return (
			<div className='avatar-dropdown-loading'>
				<Spin size='small' />
			</div>
		);
	}

	const fullName = initialState.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || ''));

	const avatarSrc = initialState.currentUser?.picture || generateInitialsAvatar(fullName);

	return (
		<AccountMenu>
			<AccountMenuTrigger
				name={fullName}
				role={intl.formatMessage({ id: AppModules[currentRole].title })}
				avatarSrc={avatarSrc}
			/>
			<AccountMenuOptions>
				{dsPhanVung?.length >= 2 && (
					<>
						{dsPhanVung.map((item) => {
							const code = item?.dataPartitionCode;
							const isActive = code === currentPartition;

							return (
								<AccountMenuItem
									key={`partition-${code}`}
									icon={<IconCheck style={{ visibility: isActive ? 'visible' : 'hidden' }} />}
									onClick={() => {
										if (code) localStorage.setItem('partitionCode', code);
										window.location.reload();
									}}
								>
									{item?.dataPartition?.name ?? item?.dataPartition?.ma}
								</AccountMenuItem>
							);
						})}
						<AccountMenuSeparator />
					</>
				)}

				<AccountMenuItem icon={<IconLogoMicrosoft />} onClick={() => window.open('https://office.com/')}>
					Office 365
				</AccountMenuItem>

				<AccountMenuItem icon={<IconEarth />} onClick={() => window.open(landingUrl)}>
					{intl.formatMessage({ id: 'modules.cong-thong-tin' }) ||
						intl.formatMessage({ id: 'app.header.portal', defaultMessage: 'Cổng thông tin' })}
				</AccountMenuItem>

				<AccountMenuSeparator />

				<AccountMenuItem icon={<IconDoor01 />} onClick={loginOut}>
					{intl.formatMessage({ id: 'app.header.logout', defaultMessage: 'Đăng xuất' })}
				</AccountMenuItem>
			</AccountMenuOptions>
		</AccountMenu>
	);
};

export default AvatarDropdown;
