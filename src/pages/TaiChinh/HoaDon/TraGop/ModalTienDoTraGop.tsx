import { getPhienTraGop } from '@/services/TaiChinh/TraGop';
import { EMauTrangThaiPhienTraGop, ETrangThaiPhienTraGop } from '@/services/TaiChinh/TraGop/constant';
import type { TraGop } from '@/services/TaiChinh/TraGop/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { inputFormat } from '@/utils/utils';
import { Modal, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

interface ModalTienDoTraGopProps {
	visible: boolean;
	bill?: HoaDon.IRecord;
	onClose: () => void;
}

const ModalTienDoTraGop: React.FC<ModalTienDoTraGopProps> = ({ visible, bill, onClose }) => {
	const intl = useIntl();
	const [loading, setLoading] = useState(false);
	const [danhSach, setDanhSach] = useState<TraGop.IPhienTraGop[]>([]);

	useEffect(() => {
		if (!visible || !bill?._id) {
			setDanhSach([]);
			return;
		}

		setLoading(true);
		getPhienTraGop(bill._id)
			.then((res) => setDanhSach(res?.data?.data ?? []))
			.catch(() => setDanhSach([]))
			.finally(() => setLoading(false));
	}, [visible, bill?._id]);

	const getStatusLabel = (trangThai: ETrangThaiPhienTraGop) =>
		intl.formatMessage({ id: `taichinh.tragop.phien.status.${trangThai}` });

	return (
		<Modal
			open={visible}
			onCancel={onClose}
			footer={null}
			width={700}
			title={intl.formatMessage({ id: 'taichinh.tragop.tiendo.title' }, { identityCode: bill?.identityCode ?? '' })}
		>
			<Table
				loading={loading}
				dataSource={danhSach}
				rowKey='_id'
				pagination={false}
				columns={[
					{
						title: intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.lan' }),
						dataIndex: 'lanTraGop',
						align: 'center',
						width: 80,
					},
					{
						title: intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.sotien' }),
						dataIndex: 'soTien',
						align: 'right',
						render: (val) => `${inputFormat(val ?? 0)} VND`,
					},
					{
						title: intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.sotiendanop' }),
						dataIndex: 'soTienDaNop',
						align: 'right',
						render: (val) => `${inputFormat(val ?? 0)} VND`,
					},
					{
						title: intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.hannop' }),
						dataIndex: 'ngayHetHan',
						align: 'center',
						render: (val) => (val ? dayjs(val).format('DD/MM/YYYY') : ''),
					},
					{
						title: intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.trangthai' }),
						dataIndex: 'trangThai',
						align: 'center',
						render: (val: ETrangThaiPhienTraGop) => (
							<Tag color={EMauTrangThaiPhienTraGop[val]}>{getStatusLabel(val)}</Tag>
						),
					},
				]}
			/>
		</Modal>
	);
};

export default ModalTienDoTraGop;
