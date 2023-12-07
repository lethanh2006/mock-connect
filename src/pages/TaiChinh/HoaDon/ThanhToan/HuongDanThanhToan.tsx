import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Col, Descriptions, Radio, Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';
import './style.less';

const HuongDanThanhToan = (props: {
	totalPhaiNop?: number;
	dataHienThi?: HoaDon.IBillItem[];
	isDongTruoc?: boolean;
	amountPay?: number;
}) => {
	const { totalPhaiNop, dataHienThi, isDongTruoc, amountPay } = props;
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const [visibleHuongDan, setVisibleHuongDan] = useState<boolean>(false);
	const [paymentType, setPaymentType] = useState<string>();
	const [infoMomo, setInfoMomo] = useState<ChiTietThu.IResponseMomo>();
	const payable =
		isDongTruoc ||
		recHoaDon?.status === EMaTrangThaiThanhToan.CHUA_THANH_TOAN ||
		recHoaDon?.status === EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU;

	useEffect(() => {
		if (!paymentType && payable) setPaymentType('atm');
	}, [recHoaDon?.status]);

	const onChangeType = async (type: string) => {
		setPaymentType(type);
		// if (type === 'momo' && !infoMomo && recHoaDon?.identityCode)
		// 	await postThongTinMomo({
		// 		identityCode: recHoaDon?.identityCode,
		// 		redirectUrl: window.location.origin + window.location.pathname,
		// 	}).then((res) => setInfoMomo(res.data?.data));
	};

	// const onPaid = () => {
	// 	if (paymentType === 'atm') setVisibleHuongDan(true);
	// 	else if (paymentType === 'momo' && !!infoMomo?.payUrl) window.location.href = infoMomo.payUrl;
	// };

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col span={24} md={8}>
					<Radio.Group
						className='radio-thanh-toan'
						disabled={!payable}
						value={paymentType}
						onChange={(val) => onChangeType(val.target.value)}
					>
						<Radio value='atm'>
							<img src='/images/vietqr.png' alt='vietqr' />
							Thẻ nội địa
						</Radio>
						<Radio value='momo'>
							<img src='/images/momo.svg' alt='momo' />
							Ví MOMO
						</Radio>
					</Radio.Group>
				</Col>
				<Col span={24} md={16}>
					<Descriptions column={1} bordered labelStyle={{ width: '50%' }}>
						{!isDongTruoc ? (
							<>
								<Descriptions.Item label='Số tiền thanh toán'>{inputFormat(totalPhaiNop ?? 0)} VNĐ</Descriptions.Item>
								<Descriptions.Item label='Tổng ưu đãi'>
									0{/* {inputFormat(record?.amountPaid ?? 0)} VNĐ */}
								</Descriptions.Item>
							</>
						) : null}
						<Descriptions.Item label='Số tiền cần nộp thêm'>
							{isDongTruoc ? (
								<>{inputFormat(amountPay)} VNĐ</>
							) : (
								<>
									{inputFormat(
										_.sumBy(dataHienThi, (item) => item.amountDue) - _.sumBy(dataHienThi, (item) => item.amountPaid) ??
											0,
									)}{' '}
									VNĐ
								</>
							)}
						</Descriptions.Item>
						{paymentType === 'momo' ? (
							//  && !!infoMomo
							<>
								<Descriptions.Item
									label={`Phí người dùng (${infoMomo?.userFeePercent}%, tối đa ${inputFormat(
										infoMomo?.userFeeMax,
									)} VNĐ)`}
								>
									{inputFormat(infoMomo?.userFee ?? 0)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label='Tổng tiền thanh toán'>
									{inputFormat((totalPhaiNop ?? 0) + (infoMomo?.userFee ?? 0))} VNĐ
								</Descriptions.Item>
							</>
						) : null}
					</Descriptions>
				</Col>
			</Row>

			<ModalThanhToanNganHang visibleHuongDan={visibleHuongDan} setVisibleHuongDan={setVisibleHuongDan} />
		</>
	);
};

export default HuongDanThanhToan;
