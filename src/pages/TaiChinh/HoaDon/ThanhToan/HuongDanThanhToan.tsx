import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { getPublicAssetPath } from '@/utils/path';
import { inputFormat } from '@/utils/utils';
import { Col, Row } from '@/components/MyGrid';
import { Descriptions, Radio, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';

const HuongDanThanhToan = (props: {
	thanhToan?: number;
	tongUuDai?: number;
	amount: number;
	duNo?: number;
	isRequired?: boolean;
}) => {
	const intl = useIntl();
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
							<Radio value={ETransactionPaymentType.MANUAL}>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.sodu' })}
							</Radio>
						) : (
							<>
								<Radio value={ETransactionPaymentType.BANK}>
									<img src={getPublicAssetPath('images/vietqr.png')} alt='vietqr' />
									{intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.thenoidia' })}
								</Radio>
								{/* <Radio value={ETransactionPaymentType.MOMO_WALLET}>
									<img src={getPublicAssetPath('images/momo.svg')} alt='momo' />
									Ví MOMO
								</Radio> */}
							</>
						)}
					</Radio.Group>
				</Col>

				<Col span={24} md={16}>
					<Descriptions column={1} bordered labelStyle={{ width: '50%' }}>
						{thanhToan ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.sotien' })}>
								{inputFormat(thanhToan)} VNĐ
							</Descriptions.Item>
						) : null}
						{tongUuDai ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.tonguudau' })}>
								{inputFormat(tongUuDai)} VNĐ
							</Descriptions.Item>
						) : null}
						<Descriptions.Item
							label={
								thanhToan
									? intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.sotiencannop' })
									: intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.svnop' })
							}
						>
							{inputFormat(amount)} VNĐ
						</Descriptions.Item>
						{duNo ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.tiendu' })}>
								{inputFormat(duNo)} VNĐ
							</Descriptions.Item>
						) : null}

						{paymentType === ETransactionPaymentType.MOMO_WALLET && !!momoConfig ? (
							<>
								<Descriptions.Item
									label={intl.formatMessage(
										{ id: 'taichinh.thanhtoan.huongdan.phi' },
										{
											userFeePercent: momoConfig.userFeePercent ?? 0,
											userFeeMax: momoConfig?.userFeeMax ?? 0,
										},
									)}
								>
									{inputFormat(userFee)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.huongdan.tongthanhtoan' })}>
									{inputFormat(amount + userFee)} VNĐ
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
