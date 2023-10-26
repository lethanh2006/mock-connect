import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { Modal } from 'antd';

const ModalThanhToan = (props: {
	visible: boolean;
	onOk: () => void;
	onCancel: () => void;
	items: ChiTietThu.Record[];
}) => {
	const { visible, onCancel, onOk } = props;

	return (
		<Modal
			visible={visible}
			onCancel={() => onCancel()}
			title='Thanh toán công nợ'
			width={800}
			footer={null}
			maskClosable={false}
		>
			ModalThanhToan
		</Modal>
	);
};

export default ModalThanhToan;
