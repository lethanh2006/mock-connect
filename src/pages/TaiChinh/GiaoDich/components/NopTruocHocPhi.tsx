import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { inputFormat } from '@/utils/utils';
import { Alert, Button, Col, Descriptions, Form, Modal, Popconfirm, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import HuongDanThanhToan from '../../HoaDon/ThanhToan/HuongDanThanhToan';

const ModalNopTruocHocPhi = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	getData: () => void;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, getData } = props;
	const { dongTruocHocPhiModel, formSubmiting, paymentType, setVisibleHuongDan, thanhToanMomoModel, setRecord } =
		useModel('taichinh.giaodich');
	const { record: recThuTruocHp } = useModel('taichinh.dotthutruochocphi');
	const { record: recDotThu, getByIdModel: getDotThu } = useModel('taichinh.dotthu');
	const { getMucThuHocPhiTheoNamModel, mucThuMe } = useModel('taichinh.mucthuhocphi');
	const { initialState } = useModel('@@initialState');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const maKhoaNganh: string = Form.useWatch('maKhoaNganh', form);

	const ngoaiThoiGian =
		!recThuTruocHp?._id ||
		!recThuTruocHp?.thoiGianBatDau ||
		!recThuTruocHp?.thoiGianKetThuc ||
		dayjs().isBefore(dayjs(recThuTruocHp?.thoiGianBatDau)) ||
		dayjs().isAfter(dayjs(recThuTruocHp?.thoiGianKetThuc));

	useEffect(() => {
		if (recThuTruocHp?._id) getMucThuHocPhiTheoNamModel(recThuTruocHp?.maNamHoc);
	}, [recThuTruocHp?._id]);

	//Số tiền trên 1 tín chỉ
	const soTienTinChi =
		khoaNganhMe?.khoaNganhChinh?.ma === maKhoaNganh
			? (mucThuMe?.mucThuKhoaNganhChinh?.unitAmount ?? 0)
			: (mucThuMe?.mucThuKhoaNganhPhu?.unitAmount ?? 0);

	//Số tiền phải đóng để được hưởng ưu đãi
	const soTienPhaiDong = soTienTinChi * (recThuTruocHp?.soTinChiNhanUuDai ?? 0);

	//Số tiền ưu đãi
	const soTienUuDai = soTienPhaiDong * (recThuTruocHp?.uuDai?.phanTramUuDai / 100);

	const handleShowModalThanhToan = async (tran: GiaoDich.IRecord) => {
		// Get đợt thu trước khi hiển thị modal để lấy thông tin kênh thanh toán
		if (recDotThu?._id !== tran?.idDotThu || (!!recDotThu?.kenhThanhToanId && !recDotThu?.kenhThanhToan?._id)) {
			await getDotThu(tran?.idDotThu);
		}
		// Set record để hiển thị thông tin thanh toán
		setRecord(tran);
		setVisibleHuongDan(true);
	};

	const onFinish = (values: any) => {
		const data: GiaoDich.TDongTruocHocPhi = {
			...values,
			name: `Nộp trước học phí ${recThuTruocHp?.tenNamHoc || `Năm học ${recThuTruocHp?.maNamHoc}` || ''} MSV ${
				initialState?.currentUser?.preferred_username ?? ''
			}`,
			amount: soTienPhaiDong - soTienUuDai,
			paymentType,
			idDotThuTruocHocPhi: recThuTruocHp?._id,
			userMaKhoaSinhVien:
				values?.maKhoaNganh === khoaNganhMe?.khoaNganhChinh?.ma
					? khoaNganhMe?.khoaNganhChinh?.maKhoaSinhVien
					: khoaNganhMe?.khoaNganhPhu?.maKhoaSinhVien,
			userMaNganh:
				values?.maKhoaNganh === khoaNganhMe?.khoaNganhChinh?.ma
					? khoaNganhMe?.khoaNganhChinh?.maNganh
					: khoaNganhMe?.khoaNganhPhu?.maNganh,
		};
		dongTruocHocPhiModel(data)
			.then((rec) => {
				if (getData) getData();
				setVisibleForm(false);
				if (rec.paymentType === ETransactionPaymentType.BANK) {
					handleShowModalThanhToan(rec);
				} else if (rec.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
					thanhToanMomoModel(rec.identityCode);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			title={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.title' })}
			footer={null}
			width={800}
		>
			{ngoaiThoiGian ? (
				<Alert
					type='warning'
					showIcon
					description={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.empty' })}
				/>
			) : (
				<Form layout='vertical' form={form} onFinish={onFinish}>
					<Row gutter={[12, 12]}>
						<Col span={24}>
							<Alert
								showIcon
								description={
									<div>
										<div>{intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.alert.title' })}</div>
										<div>
											{intl.formatMessage(
												{ id: 'lichsugiaodich.noptruochocphi.alert.thoigian' },
												{
													form: dayjs(recThuTruocHp?.thoiGianBatDau).format('HH:mm DD/MM/YYYY'),
													to: dayjs(recThuTruocHp?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY'),
													b: (chunks) => <b>{chunks}</b>,
												},
											)}
										</div>
									</div>
								}
							/>
						</Col>

						<Col span={24} md={12}>
							<Form.Item
								name='maKhoaNganh'
								label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.form.nganh' })}
								rules={[...rules.required]}
							>
								<SelectSongNganh />
							</Form.Item>
						</Col>
						<Col span={24}>
							<div style={{ fontSize: 16 }}>
								{intl.formatMessage(
									{ id: 'lichsugiaodich.noptruochocphi.desc.intro' },
									{
										form: recThuTruocHp?.soTinChiNhanUuDai,
										to: recThuTruocHp?.uuDai?.phanTramUuDai,
										b: (chunks) => <b>{chunks}</b>,
									},
								)}
							</div>
						</Col>
						<Col span={24}>
							<Descriptions column={1}>
								<Descriptions.Item label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.namhoc' })}>
									<b style={{ color: 'red' }}>{recThuTruocHp?.tenNamHoc}</b>
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.dinhmuc' })}>
									{inputFormat(soTienTinChi)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.sotinchi' })}>
									{recThuTruocHp?.soTinChiNhanUuDai}{' '}
									{intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.tinchi' })}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.tongtien' })}>
									{inputFormat(soTienPhaiDong)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.miengiam' })}>
									{inputFormat(soTienUuDai)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.desc.thucte' })}>
									{inputFormat(soTienPhaiDong - soTienUuDai)} VNĐ
								</Descriptions.Item>
							</Descriptions>
						</Col>

						<Col span={24}>
							<div className='fw500'>
								{intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.payment.hinhthuc' })}
							</div>
						</Col>
						<Col span={24}>
							<HuongDanThanhToan amount={soTienPhaiDong - soTienUuDai} isRequired />
						</Col>
					</Row>

					<div className='form-footer'>
						<Popconfirm
							title={intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.confirm.pay' })}
							onConfirm={() => form.submit()}
							disabled={!maKhoaNganh}
						>
							<Button disabled={!maKhoaNganh} loading={formSubmiting} type='primary' htmlType='submit'>
								{intl.formatMessage({ id: 'lichsugiaodich.noptruochocphi.button.pay' })}
							</Button>
						</Popconfirm>

						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			)}
		</Modal>
	);
};

export default ModalNopTruocHocPhi;
