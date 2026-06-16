import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ETransactionPaymentType, ETransactionSourceType, ETransactionStatus } from '@/services/TaiChinh/constant';
import { Button, Card, Col, Modal, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { disableThanhToan } from '..';
import DesThongTinHoaDon from '../ChiTiet/DesThongTin';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from './LichSuThanhToan';

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { setVisible, getData } = props;
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const { visibleThanhToan, setVisibleThanhToan, xemRutGonChiTiet, setXemRutGonChiTiet } =
		useModel('taichinh.hoadonchitiet');
	const {
		getAllModel,
		record: recGiaoDich,
		setRecord,
		loading,
		visibleHuongDan,
		setVisibleHuongDan,
		thanhToanMomoModel,
		huyThanhToanModel,
	} = useModel('taichinh.giaodich');
	const { record: recDotThu, getByIdModel: getDotThu } = useModel('taichinh.dotthu');
	const [activeTab, setActiveTab] = useState('1');

	/** Get giao dịch pending */
	const getGiaoDich = () =>
		getAllModel(true, undefined, {
			status: ETransactionStatus.PENDING,
			billIdentityCode: recHoaDon?.identityCode,
			fromAccount: ETransactionSourceType.EXTERNAL,
		});

	const onChangeTab = (tab: string) => {
		setActiveTab(tab);
		// Get giao dịch nộp tiền chưa hoàn tất
		if (tab === '1' && recHoaDon?.identityCode) getGiaoDich();
	};

	useEffect(() => {
		onChangeTab('1');
	}, [recHoaDon?.identityCode]);

	const handleShowModalThanhToan = async (tran: GiaoDich.IRecord) => {
		// Get đợt thu trước khi hiển thị modal để lấy thông tin kênh thanh toán
		if (recDotThu?._id !== tran.idDotThu || (!!recDotThu.kenhThanhToanId && !recDotThu.kenhThanhToan?._id))
			await getDotThu(tran.idDotThu);
		// Set record để hiển thị thông tin thanh toán
		setRecord(tran);
		setVisibleHuongDan(true);
	};

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) {
			handleShowModalThanhToan(rec);
		} else if (rec?.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
			thanhToanMomoModel(rec.identityCode);
	};

	const onCancel = (rec: GiaoDich.IRecord) => {
		if (rec._id)
			return huyThanhToanModel(rec._id)
				.then(() => {
					getGiaoDich();
					if (getData) getData();
				})
				.catch((er) => console.log(er));
		else return Promise.reject();
	};

	return (
		<Card title={intl.formatMessage({ id: 'taichinh.thanhtoan.title' })}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<DesThongTinHoaDon />
				</Col>

				<Col span={24}>
					<Tabs
						activeKey={activeTab}
						onChange={onChangeTab}
						items={[
							{
								key: '1',
								label: 'Chi tiết',
								children: <FormItemHoaDonChiTiet />,
							},
							{
								key: '2',
								label: 'Lịch sử thanh toán',
								children: (
									<LichSuThanhToan
										onPay={onPay}
										onCancel={onCancel}
										ngoaiThoiGianThanhToan={disableThanhToan(recHoaDon)}
									/>
								),
							},
						]}
					/>
				</Col>
			</Row>

			<div style={{ marginTop: 18 }} className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

			<Modal
				title={intl.formatMessage({ id: 'taichinh.thanhtoan.title' })}
				open={visibleThanhToan}
				onCancel={() => setVisibleThanhToan(false)}
				footer={null}
				width={1000}
				maskClosable={false}
			>
				<FormThanhToan
					getData={() => {
						if (activeTab === '1') getGiaoDich();
						if (getData) getData();
					}}
				/>
			</Modal>

			{/* <ModalThanhToanNganHang
			visible={visibleHuongDan}
			onOk={() => {
				if (activeTab === '1') getGiaoDich();
				if (getData) getData();
				setVisibleHuongDan(false);
			}}
		/> */}
		</Card>
	);
};

export default ThongTinThanhToan;
