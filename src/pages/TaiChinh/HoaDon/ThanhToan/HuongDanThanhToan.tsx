import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Col, Descriptions, Radio, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
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
	const { paymentType, setPaymentType, momoConfig, getMomoConfigModel, loading } = useModel('taichinh.giaodich');
	const [userFee, setUserFee] = useState<number>(0);

	const onChangeType = async (type: ETransactionPaymentType) => {
		setPaymentType(type);
		if (type === ETransactionPaymentType.MOMO_WALLET && !momoConfig) getMomoConfigModel();
	};

	useEffect(() => {
		if (momoConfig?.userFeePercent) {
			const fee = Math.round((amount * momoConfig.userFeePercent) / 100);
			setUserFee(fee > momoConfig.userFeeMax ? momoConfig.userFeeMax : fee);
		} else setUserFee(0);
	}, [amount, momoConfig?.userFeePercent]);

	useEffect(() => {
		onChangeType(!amount && !isRequired ? ETransactionPaymentType.MANUAL : ETransactionPaymentType.BANK);
	}, [!!amount, isRequired]);

	return (
		<Spin spinning={loading}>
			<Row gutter={[12, 12]}>
				<Col span={24} md={8}>
					<Radio.Group
						className='radio-thanh-toan'
						value={paymentType}
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
								{/* <Radio value={ETransactionPaymentType.MOMO_WALLET}>
									<img src='/images/momo.svg' alt='momo' />
									Ví MOMO
								</Radio> */}
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

						{paymentType === ETransactionPaymentType.MOMO_WALLET && !!momoConfig ? (
							<>
								<Descriptions.Item
									label={`Phí người dùng (${momoConfig?.userFeePercent ?? 0}%, tối đa ${inputFormat(
										momoConfig?.userFeeMax ?? 0,
									)} VNĐ)`}
								>
									{inputFormat(userFee)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label='Tổng tiền thanh toán'>{inputFormat(amount + userFee)} VNĐ</Descriptions.Item>
							</>
						) : null}
					</Descriptions>
				</Col>
			</Row>
		</Spin>
	);
};

export default HuongDanThanhToan;
