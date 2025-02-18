import ButtonExtend from '@/components/Table/ButtonExtend';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	EMaTrangThaiThanhToan,
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
} from '@/services/TaiChinh/constant';
import { AppstoreAddOutlined, DollarOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Col, Modal, Row, Space, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CanhBaoGiaoDich from '../../GiaoDich/components/CanhBao';
import DesThongTinHoaDon from '../ChiTiet/DesThongTin';
import FormItemHoaDonChiTiet from '../ChiTiet/FormItem';
import FormThanhToan from '../ThanhToan/FormThanhToan';
import LichSuThanhToan from '../ThanhToan/LichSuThanhToan';
import ModalThanhToanNganHang from './ModalThanhToanNganHang';

const ThongTinThanhToan = (props: { setVisible: (val: boolean) => void; getData?: () => void }) => {
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
	const ngoaiThoiGianThanhToan =
		!recHoaDon?.dotThu?._id ||
		!recHoaDon?.dotThu?.thoiGianBatDau ||
		!recHoaDon?.dotThu?.thoiGianKetThuc ||
		moment().isBefore(recHoaDon.dotThu.thoiGianBatDau) ||
		moment().isAfter(recHoaDon.dotThu.thoiGianKetThuc) ||
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
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<DesThongTinHoaDon />
				</Col>

				<Col span={24}>
					<Tabs activeKey={activeTab} onChange={(tab) => onChangeTab(tab)}>
						<Tabs.TabPane key={'1'} tab='Chi tiết' />
						<Tabs.TabPane key={'2'} tab='Lịch sử giao dịch' />
					</Tabs>

					{activeTab === '1' ? (
						<Space direction='vertical' style={{ width: '100%' }}>
							{recGiaoDich?._id &&
							recGiaoDich.paymentType !== ETransactionPaymentType.MANUAL &&
							!ngoaiThoiGianThanhToan ? (
								<Alert
									message='Có giao dịch nộp tiền đang chờ xử lý! Bạn đã thực hiện thanh toán chưa?'
									description='(Nếu đã thanh toán, vui lòng bỏ qua thông báo này)'
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
												Thanh toán ngay
											</Button>
											{/* <Popconfirm title='Xác nhận hủy giao dịch này?' onConfirm={() => onCancel(recGiaoDich)}>
												<Button danger type='link'>
													Hủy giao dịch
												</Button>
											</Popconfirm> */}
										</Space>
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
										tooltip={ngoaiThoiGianThanhToan ? 'Ngoài thời gian hoặc chưa mở đợt thanh toán' : undefined}
									>
										Thông tin thanh toán
									</ButtonExtend>

									<Checkbox checked={xemRutGonChiTiet} onChange={(e) => setXemRutGonChiTiet(e.target.checked)}>
										Rút gọn
									</Checkbox>
									<i>(Xem chi tiết Số dư ví hiện tại, số tiền cần nộp và hướng dẫn thanh toán)</i>
								</Space>
							)}

							<FormItemHoaDonChiTiet />
						</Space>
					) : (
						<>
							<CanhBaoGiaoDich />
							<LichSuThanhToan onPay={onPay} onCancel={onCancel} ngoaiThoiGianThanhToan={ngoaiThoiGianThanhToan} />
						</>
					)}
				</Col>
			</Row>

			<div style={{ marginTop: 18 }} className='form-footer'>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>

			<Modal
				title='Thông tin thanh toán'
				visible={visibleThanhToan}
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
