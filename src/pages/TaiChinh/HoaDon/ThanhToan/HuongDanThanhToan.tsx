import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Col, Descriptions, Radio, Row, Spin } from 'antd';
import { useModel } from 'umi';
import './style.less';

const HuongDanThanhToan = (props: {
	thanhToan?: number;
	tongUuDai?: number;
	amount: number;
	duNo?: number;
	isRequired?: boolean;
}) => {
	const { thanhToan, tongUuDai, amount, duNo, isRequired } = props;
	const {
		record: recHoaDon,
		paymentType,
		setPaymentType,
		infoMomo,
		getInfoMomoModel,
		loading,
	} = useModel('taichinh.hoadon');

	const onChangeType = async (type: ETransactionPaymentType) => {
		setPaymentType(type);
		if (type === ETransactionPaymentType.MOMO_WALLET && !infoMomo && recHoaDon?.identityCode)
			getInfoMomoModel(recHoaDon.identityCode);
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[12, 12]}>
				<Col span={24} md={8}>
					<Radio.Group
						className='radio-thanh-toan'
						value={
							!amount && !isRequired ? ETransactionPaymentType.MANUAL : paymentType ?? ETransactionPaymentType.BANK
						}
						onChange={(val) => onChangeType(val.target.value)}
						disabled={!amount}
					>
						{!amount && !isRequired ? (
							<Radio value={ETransactionPaymentType.MANUAL}>Số dư ví hiện tại</Radio>
						) : (
							<>
								<Radio value={ETransactionPaymentType.BANK}>
									<img src='/images/vietqr.png' alt='vietqr' />
									Thẻ nội địa
								</Radio>
								<Radio value={ETransactionPaymentType.MOMO_WALLET}>
									<img src='/images/momo.svg' alt='momo' />
									Ví MOMO
								</Radio>
							</>
						)}
					</Radio.Group>
				</Col>

				<Col span={24} md={16}>
					<Descriptions column={1} bordered labelStyle={{ width: '50%' }}>
						{thanhToan ? (
							<Descriptions.Item label='Số tiền thanh toán'>{inputFormat(thanhToan)} VNĐ</Descriptions.Item>
						) : null}
						{tongUuDai ? <Descriptions.Item label='Tổng ưu đãi'>{inputFormat(tongUuDai)} VNĐ</Descriptions.Item> : null}
						<Descriptions.Item label={thanhToan ? 'Số tiền cần nộp thêm' : 'Số tiền sinh viên nộp'}>
							{inputFormat(amount)} VNĐ
						</Descriptions.Item>
						{duNo ? (
							<Descriptions.Item label='Số tiền dư nợ sau khi thanh toán'>{inputFormat(duNo)} VNĐ</Descriptions.Item>
						) : null}

						{paymentType === ETransactionPaymentType.MOMO_WALLET && !!infoMomo ? (
							<>
								<Descriptions.Item
									label={`Phí người dùng (${infoMomo?.userFeePercent ?? 0}%, tối đa ${inputFormat(
										infoMomo?.userFeeMax ?? 0,
									)} VNĐ)`}
								>
									{inputFormat(infoMomo?.userFee ?? 0)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label='Tổng tiền thanh toán'>
									{inputFormat((amount ?? 0) + (infoMomo?.userFee ?? 0))} VNĐ
								</Descriptions.Item>
							</>
						) : null}
					</Descriptions>
				</Col>
			</Row>
		</Spin>
	);
};

export default HuongDanThanhToan;
