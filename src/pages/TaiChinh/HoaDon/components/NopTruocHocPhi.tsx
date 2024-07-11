import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import rules from '@/utils/rules';
import { inputFormat } from '@/utils/utils';
import { Alert, Button, Col, Descriptions, Form, Modal, Popconfirm, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import HuongDanThanhToan from '../ThanhToan/HuongDanThanhToan';

const ModalNopTruocHocPhi = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	getData: () => void;
}) => {
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, getData } = props;
	const { dongTruocHocPhiModel, formSubmiting, paymentType, setVisibleHuongDan, thanhToanMomoModel, setRecord } =
		useModel('taichinh.giaodich');
	const { record } = useModel('taichinh.dotthutruochocphi');
	const { getMucThuHocPhiTheoNamModel, mucThuMe } = useModel('taichinh.mucthuhocphi');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const maKhoaNganh: string = Form.useWatch('maKhoaNganh', form);

	const ngoaiThoiGian =
		!record?._id ||
		!record?.thoiGianBatDau ||
		!record?.thoiGianKetThuc ||
		moment().isBefore(record?.thoiGianBatDau) ||
		moment().isAfter(record?.thoiGianKetThuc);

	useEffect(() => {
		if (record?._id) getMucThuHocPhiTheoNamModel(record?.maNamHoc);
	}, [record?._id]);

	//Số tiền trên 1 tín chỉ
	const soTienTinChi =
		khoaNganhMe?.khoaNganhChinh?.ma === maKhoaNganh
			? mucThuMe?.mucThuKhoaNganhChinh?.unitAmount ?? 0
			: mucThuMe?.mucThuKhoaNganhPhu?.unitAmount ?? 0;

	//Số tiền phải đóng để được hưởng ưu đãi
	const soTienPhaiDong = soTienTinChi * (record?.soTinChiNhanUuDai ?? 0);

	//Số tiền ưu đãi
	const soTienUuDau = soTienPhaiDong * (record?.uuDai?.phanTramUuDai / 100);

	const onFinish = (values: any) => {
		dongTruocHocPhiModel({ ...values, paymentType })
			.then((rec) => {
				if (getData) getData();
				setVisibleForm(false);
				if (rec.paymentType === ETransactionPaymentType.BANK) {
					setRecord(rec);
					setVisibleHuongDan(true);
				} else if (rec.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
					thanhToanMomoModel(rec.identityCode);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			title='Nộp trước học phí'
			footer={null}
			width={800}
		>
			{ngoaiThoiGian ? (
				<Alert
					type='warning'
					showIcon
					description='Không có thông tin nộp trước học phí, vui lòng thanh toán học phí khi có thông báo cụ thể!'
				/>
			) : (
				<Form layout='vertical' form={form} onFinish={onFinish}>
					<Row gutter={[12, 12]}>
						<Col span={24}>
							<Alert
								showIcon
								description={
									<div>
										<div>Nộp trước học phí cả năm để được hưởng những ưu đãi hấp dẫn!</div>
										<div>
											Thời gian từ {<b>{moment(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</b>} đến
											{<b>{moment(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</b>}.
										</div>
									</div>
								}
							/>
						</Col>

						<Col span={24} md={12}>
							<Form.Item name='maKhoaNganh' label='Ngành đào tạo' rules={[...rules.required]}>
								<SelectSongNganh />
							</Form.Item>
						</Col>
						<Col span={24}>
							<div style={{ fontSize: 17 }}>
								Sinh viên nộp học phí 1 lần cho cả năm học, tương đương với học phí cho{' '}
								<b>{record?.soTinChiNhanUuDai} tín chỉ</b> sẽ được Học viện miễn giảm học phí bằng{' '}
								<b>{record?.uuDai?.phanTramUuDai}%</b> trên tổng số tiền nộp.
							</div>
						</Col>
						<Col span={24}>
							<Descriptions column={1}>
								<Descriptions.Item label='Năm học'>
									<b style={{ color: 'red' }}>{record?.tenNamHoc}</b>
								</Descriptions.Item>
								<Descriptions.Item label='Định mức tín chỉ theo ngành'>
									{inputFormat(soTienTinChi)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label='Số tín chỉ cần nộp để được hưởng ưu đãi'>
									{record?.soTinChiNhanUuDai} tín chỉ
								</Descriptions.Item>
								<Descriptions.Item label='Tổng tiền'>{inputFormat(soTienPhaiDong)} VNĐ</Descriptions.Item>
								<Descriptions.Item label='Số tiền được miễn giảm'>{inputFormat(soTienUuDau)} VNĐ</Descriptions.Item>
								<Descriptions.Item label='Số tiền đóng thực tế'>
									{inputFormat(soTienPhaiDong - soTienUuDau)} VNĐ
								</Descriptions.Item>
							</Descriptions>
						</Col>

						<Col span={24}>
							<div className='fw500'>Hình thức thanh toán</div>
						</Col>
						<Col span={24}>
							<HuongDanThanhToan amount={soTienPhaiDong - soTienUuDau} isRequired />
						</Col>
					</Row>

					<div className='form-footer'>
						<Popconfirm title='Xác nhận thanh toán?' onConfirm={() => form.submit()} disabled={!maKhoaNganh}>
							<Button disabled={!maKhoaNganh} loading={formSubmiting} type='primary' htmlType='submit'>
								Thanh toán
							</Button>
						</Popconfirm>

						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				</Form>
			)}
		</Modal>
	);
};

export default ModalNopTruocHocPhi;
