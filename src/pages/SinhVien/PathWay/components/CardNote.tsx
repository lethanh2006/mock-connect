import { ETrangThaiDuyetLoTrinh, mapNamTrangThaiDuyetLoTrinh } from '@/services/DaoTao/ChuongTrinhDaoTao/constant';
import { formatDateTime } from '@/utils/formatDate';
import { IconShieldCheck, IconStopwatch, IconWarningCircle, IconShieldInfo } from '@/components/Icons';
import { Alert, Divider, Typography } from 'antd';
import { useIntl, useModel } from 'umi';

const { Text } = Typography;

const CardNotePathWay = () => {
	const intl = useIntl();
	const { record: recLoTrinh } = useModel('sinhvien.lotrinhhoctap');

	const trangThai = recLoTrinh?.trangThaiDuyet as ETrangThaiDuyetLoTrinh;

	const getStatusConfig = () => {
		switch (trangThai) {
			case ETrangThaiDuyetLoTrinh.DA_DUYET:
				return { type: 'success' as const, icon: <IconShieldCheck /> };
			case ETrangThaiDuyetLoTrinh.CHO_DUYET:
				return { type: 'warning' as const, icon: <IconStopwatch /> };
			case ETrangThaiDuyetLoTrinh.TU_CHOI:
				return { type: 'error' as const, icon: <IconWarningCircle /> };
			default:
				return { type: 'info' as const, icon: <IconShieldInfo /> };
		}
	};

	const config = getStatusConfig();

	const renderDescription = () => {
		if (trangThai === ETrangThaiDuyetLoTrinh.CHUA_DANG_KY || trangThai === ETrangThaiDuyetLoTrinh.CHO_DUYET) {
			return <Text type='secondary'>Vui lòng kiểm tra lại lộ trình học tập của bạn.</Text>;
		}

		return (
			<>
				<Text strong>{recLoTrinh?.tenNguoiDuyet ?? '--'}</Text>
				<Divider type='vertical' />
				<Text type='secondary'>{recLoTrinh?.thoiGianDuyet ? formatDateTime(recLoTrinh.thoiGianDuyet) : '--'}</Text>
				{recLoTrinh?.ghiChuDuyet && (
					<div style={{ marginTop: 4, fontStyle: 'italic' }}>
						<Text type='danger'>Ghi chú: {recLoTrinh.ghiChuDuyet}</Text>
					</div>
				)}
			</>
		);
	};

	return (
		<Alert
			showIcon
			icon={config.icon}
			type={config.type}
			style={{
				marginBottom: 16,
			}}
			message={
				<Text strong style={{ fontSize: 15 }}>
					{mapNamTrangThaiDuyetLoTrinh[trangThai]}
				</Text>
			}
			description={renderDescription()}
		/>
	);
};

export default CardNotePathWay;
