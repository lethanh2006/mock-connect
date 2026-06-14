import { KenhThanhToan } from '@/services/TaiChinh/KenhThanhToan/typing';
import { Col, Modal, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import PaymentDetail from './PaymentDetail';
import PaymentMethodList from './PaymentMethodList';
import './style.less';
import type { ModalThanhToanProps } from './typing';

const ModalThanhToan: React.FC<ModalThanhToanProps> = ({ visible, onClose, onSuccess }) => {
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const {
		danhSach: danhSachKenh,
		getAllModel: getKenhThanhToan,
		loading: loadingKenh,
	} = useModel('taichinh.kenhthanhtoan');
	const { thanhToanMomoModel, loading: loadingPayment } = useModel('taichinh.giaodich');

	const [selectedMethod, setSelectedMethod] = useState<KenhThanhToan.IRecord | null>(null);

	// Load danh sách kênh thanh toán khi modal mở
	useEffect(() => {
		if (visible) {
			getKenhThanhToan(undefined, undefined, { active: true })
				.then((res) => {
					if (res.length && !selectedMethod) {
						setSelectedMethod(res.find((k) => k.isMacDinh) ?? res[0]);
					}
				})
				.catch((er) => console.log(er));
		}
	}, [visible]);

	// Tính tổng tiền từ transactions
	const totalAmount = useMemo(() => {
		return recHoaDon?.transactions?.reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0;
	}, [recHoaDon?.transactions]);

	return (
		<Modal
			open={visible}
			onCancel={onClose}
			footer={null}
			width={800}
			closable
			destroyOnClose
			className='modal-thanh-toan'
		>
			<Row gutter={0} style={{ minHeight: 500 }}>
				<Col span={7} style={{ borderRight: '1px solid #f0f0f0' }}>
					<PaymentMethodList methods={danhSachKenh} selectedMethod={selectedMethod} onChange={setSelectedMethod} />
				</Col>
				<Col span={17}>
					{selectedMethod && (
						<PaymentDetail
							bill={recHoaDon}
							method={selectedMethod}
							transactions={recHoaDon?.transactions ?? []}
							invoiceCode={recHoaDon?.identityCode ?? ''}
							totalAmount={totalAmount}
							loading={loadingKenh || loadingPayment}
						/>
					)}
				</Col>
			</Row>
		</Modal>
	);
};

export default ModalThanhToan;
