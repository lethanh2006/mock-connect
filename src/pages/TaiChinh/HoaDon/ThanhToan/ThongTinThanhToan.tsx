import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ModalThanhToan';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	EMaTrangThaiThanhToan,
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
} from '@/services/TaiChinh/constant';
import dayjs from '@/utils/dayjs';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row, Space, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CanhBaoGiaoDich from '../../GiaoDich/components/CanhBao';
import DesThongTinHoaDon from '../ChiTiet/DesThongTin';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from '../ThanhToan/LichSuThanhToan';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { setVisible, getData } = props;
	const { record: recHoaDon, visibleModalThanhToan, setVisibleModalThanhToan } = useModel('taichinh.hoadon');
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
	const ngoaiThoiGianThanhToan =
		!recHoaDon?.dotThu?._id ||
		!recHoaDon?.dotThu?.thoiGianBatDau ||
		!recHoaDon?.dotThu?.thoiGianKetThuc ||
		dayjs().isBefore(dayjs(recHoaDon.dotThu.thoiGianBatDau)) ||
		dayjs().isAfter(dayjs(recHoaDon.dotThu.thoiGianKetThuc)) ||
		!recHoaDon.dotThu.kichHoat;

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
	console.log('recGiaoDich', recHoaDon);

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
					<Tabs activeKey={activeTab} onChange={(tab) => onChangeTab(tab)}>
						<Tabs.TabPane key={'1'} tab={intl.formatMessage({ id: 'taichinh.thanhtoan.tab.chitiet' })} />
						<Tabs.TabPane key={'2'} tab={intl.formatMessage({ id: 'taichinh.thanhtoan.tab.lichsu' })} />
					</Tabs>

					{activeTab === '1' ? (
						<Space direction='vertical' style={{ width: '100%' }}>
							{/* {recGiaoDich?._id &&
							recGiaoDich.paymentType !== ETransactionPaymentType.MANUAL &&
							!ngoaiThoiGianThanhToan ? (
								<Alert
									message={intl.formatMessage({ id: 'taichinh.thanhtoan.alert.pending.title' })}
									description={intl.formatMessage({ id: 'taichinh.thanhtoan.alert.pending.desc' })}
									showIcon
									type='info'
									action={
										<Space wrap>
											<Button
												type='primary'
												onClick={() => onPay(recGiaoDich)}
												icon={<DollarOutlined />}
												loading={loading}
											>
												{intl.formatMessage({ id: 'taichinh.thanhtoan.button.thanhtoan' })}
											</Button>
											{/* <Popconfirm title='Xác nhận hủy giao dịch này?' onConfirm={() => onCancel(recGiaoDich)}>
												<Button danger type='link'>
													Hủy giao dịch
												</Button>
											</Popconfirm> */}
							{/* </Space>
									}
								/>
							) : (
								<Space wrap>
									<ButtonExtend
										disabled={recHoaDon?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU || ngoaiThoiGianThanhToan}
										onClick={() => setVisibleThanhToan(true)}
										icon={<AppstoreAddOutlined />}
										type='primary'
										className='btn-success'
										loading={loading}
										notHideText
										tooltip={
											ngoaiThoiGianThanhToan
												? intl.formatMessage({ id: 'taichinh.thanhtoan.tooltip.outOfTime' })
												: undefined
										}
									>
										{intl.formatMessage({ id: 'taichinh.thanhtoan.button.thanhtoan' })}
									</ButtonExtend>

									<Checkbox checked={xemRutGonChiTiet} onChange={(e) => setXemRutGonChiTiet(e.target.checked)}>
										{intl.formatMessage({ id: 'taichinh.thanhtoan.checkbox.compact' })}
									</Checkbox>
									<i>{intl.formatMessage({ id: 'taichinh.thanhtoan.note.compact' })}</i>
								</Space>
							)} */}
							<Space wrap>
								<ButtonExtend
									disabled={recHoaDon?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU || ngoaiThoiGianThanhToan}
									onClick={() => setVisibleModalThanhToan(true)}
									icon={<AppstoreAddOutlined />}
									type='primary'
									className='btn-success'
									loading={loading}
									notHideText
									tooltip={
										ngoaiThoiGianThanhToan
											? intl.formatMessage({ id: 'taichinh.thanhtoan.tooltip.outOfTime' })
											: undefined
									}
								>
									{intl.formatMessage({ id: 'taichinh.thanhtoan.button.thanhtoan' })}
								</ButtonExtend>

								{/* <Checkbox checked={xemRutGonChiTiet} onChange={(e) => setXemRutGonChiTiet(e.target.checked)}>
									{intl.formatMessage({ id: 'taichinh.thanhtoan.checkbox.compact' })}
								</Checkbox>
								<i>{intl.formatMessage({ id: 'taichinh.thanhtoan.note.compact' })}</i> */}
							</Space>
							<FormItemHoaDonChiTiet />
						</Space>
					) : (
						<>
							<div style={{ marginBottom: 6 }}>
								<CanhBaoGiaoDich />
							</div>
							<LichSuThanhToan onPay={onPay} onCancel={onCancel} ngoaiThoiGianThanhToan={ngoaiThoiGianThanhToan} />
						</>
					)}
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

			<ModalThanhToan
				visible={visibleModalThanhToan}
				onClose={() => setVisibleModalThanhToan(false)}
				onSuccess={() => {
					if (activeTab === '1') getGiaoDich();
					if (getData) getData();
					setVisibleModalThanhToan(false);
				}}
			/>

			<ModalThanhToanNganHang
				visible={visibleHuongDan}
				onOk={() => {
					if (activeTab === '1') getGiaoDich();
					if (getData) getData();
					setVisibleHuongDan(false);
				}}
			/>
		</Card>
	);
};

export default ThongTinThanhToan;
