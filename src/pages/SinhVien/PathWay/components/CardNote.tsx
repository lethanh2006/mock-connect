import {
	ETrangThaiDuyetLoTrinh,
	mapColorTrangThaiDuyetLoTrinh,
	mapNamTrangThaiDuyetLoTrinh,
} from '@/services/DaoTao/ChuongTrinhDaoTao/constant';
import { formatDateTime } from '@/utils/formatDate';
import { Alert, Space, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const CardNotePathWay = () => {
	const intl = useIntl();
	const { record: recLoTrinh } = useModel('sinhvien.lotrinhhoctap');

	const trangThai = recLoTrinh?.trangThaiDuyet as ETrangThaiDuyetLoTrinh;

	const renderMessage = () => {
		const tenTrangThai = mapNamTrangThaiDuyetLoTrinh[trangThai];

		if (trangThai !== ETrangThaiDuyetLoTrinh.CHUA_DANG_KY && trangThai !== ETrangThaiDuyetLoTrinh.CHO_DUYET) {
			return `${tenTrangThai} bởi ${recLoTrinh?.tenNguoiDuyet ?? '--'} vào ${
				recLoTrinh?.thoiGianDuyet ? formatDateTime(recLoTrinh.thoiGianDuyet) : '--'
			}${recLoTrinh?.ghiChuDuyet ? ` (Ghi chú: ${recLoTrinh.ghiChuDuyet})` : ''}`;
		}

		return `${intl.formatMessage({ id: 'lotrinhhoctap.trangthai' })}: ${tenTrangThai}`;
	};

	return (
		<Alert
			type={
				trangThai === ETrangThaiDuyetLoTrinh.DA_DUYET
					? 'success'
					: trangThai === ETrangThaiDuyetLoTrinh.CHO_DUYET
						? 'warning'
						: 'info'
			}
			message={
				<Space wrap>
					<Tag color={mapColorTrangThaiDuyetLoTrinh[trangThai]}>{mapNamTrangThaiDuyetLoTrinh[trangThai]}</Tag>
					{renderMessage()}
				</Space>
			}
		/>
	);
};

export default CardNotePathWay;
