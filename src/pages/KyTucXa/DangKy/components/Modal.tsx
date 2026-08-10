import ModalExpandable from '@/components/Table/ModalExpandable';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { Button, Form, message, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import { chuanHoaDanhSachLienHeKhanCap } from '../NguoiThan/FormItem';
import '../style.less';
import CheckInPrepContent from './CheckInPrepContent';
import FormDangKyKTX from './Form';
import FormChinhSachKTX from './FormChinhSach';

const getTenSinhVien = (sinhVien?: SinhVien.IRecord) =>
	sinhVien?.ten || [sinhVien?.firstName, sinhVien?.lastName].filter(Boolean).join(' ');

const getDiaChiThuongTru = (sinhVien?: SinhVien.IRecord) => {
	if (!sinhVien) return undefined;
	if (typeof sinhVien.hoKhauThuongTru === 'string') return sinhVien.hoKhauThuongTru;

	const diaChiObj = sinhVien.hoKhauThuongTru as SinhVien.TDiaChi | undefined;
	const diaChiTuObj = diaChiObj
		? [diaChiObj.diaChi, diaChiObj.tenXaPhuong, diaChiObj.tenQH, diaChiObj.tenTP].filter(Boolean).join(', ')
		: '';

	return (
		diaChiTuObj ||
		[sinhVien.soNhaTenDuongThuongTru, sinhVien.xaPhuongThuongTru, sinhVien.quanHuyenThuongTru, sinhVien.tinhTpThuongTru]
			.filter(Boolean)
			.join(', ')
	);
};

const getHoTenThanhVienGiaDinh = (thanhVien: SinhVien.TThongTinGiaDinh) =>
	[thanhVien.hoDem, thanhVien.ten].filter(Boolean).join(' ').trim();

const getDiaChiThanhVienGiaDinh = (diaChi?: SinhVien.TDiaChi) =>
	[diaChi?.diaChi, diaChi?.tenXaPhuong, diaChi?.tenQH, diaChi?.tenTP].filter(Boolean).join(', ');

const mapMoiQuanHeKhanCap = (loaiThanhVien?: string) => {
	if (loaiThanhVien === 'Bố') return 'Father';
	if (loaiThanhVien === 'Mẹ') return 'Mother';
	if (loaiThanhVien === 'Người giám hộ') return 'Guardian';
	return loaiThanhVien ? 'Other' : undefined;
};

// axios (utils/axios.ts) đã tự hiện notification cho lỗi có message từ BE.
// Hàm này chỉ dùng để phát hiện case BE không trả về message gì để bổ sung thông báo chung.
const getBeErrorMessage = (error: any): string | undefined =>
	error?.response?.data?.detail?.message ||
	error?.response?.data?.message ||
	error?.response?.data?.detail?.exception?.message ||
	undefined;

const getNguoiLienHeKhanCap = (sinhVien?: SinhVien.IRecord): PhieuDangKyKTX.INguoiThan[] => {
	const thanhVienGiaDinh = sinhVien?.thanhVienGiaDinh ?? [];
	const danhSachLienHe = thanhVienGiaDinh
		.map((thanhVien, index) => ({
			index: index + 1,
			emergencyContactName: getHoTenThanhVienGiaDinh(thanhVien),
			emergencyRelationship: mapMoiQuanHeKhanCap(thanhVien.loaiThanhVien),
			emergencyContactNumber: thanhVien.soDienThoai,
			emergencyEmail: thanhVien.email,
			address: getDiaChiThanhVienGiaDinh(thanhVien.diaChiHienNay || thanhVien.hoKhauThuongTru),
		}))
		.filter(
			(thanhVien) =>
				thanhVien.emergencyContactName ||
				thanhVien.emergencyRelationship ||
				thanhVien.emergencyContactNumber ||
				thanhVien.emergencyEmail ||
				thanhVien.address,
		);

	return chuanHoaDanhSachLienHeKhanCap(danhSachLienHe)
		.filter((item: any) => !item.khoiLienHeDefault)
		.map((item, index) => ({ ...item, index: index + 1 }));
};

const getThongTinSinhVienForm = (sinhVien?: SinhVien.IRecord): Partial<PhieuDangKyKTX.IDangKy> => ({
	fullName: getTenSinhVien(sinhVien),
	studentId: sinhVien?.ma,
	dateOfBirth: sinhVien?.ngaySinh,
	gender: sinhVien?.gioiTinh,
	email: sinhVien?.email || sinhVien?.ssoId,
	phoneNumber: sinhVien?.soDienThoai,
	program: sinhVien?.chuyenNganh?.ten || sinhVien?.nganh?.tenTiengAnh || sinhVien?.nganh?.ten,
	college: sinhVien?.nganh?.tenVietTat || sinhVien?.nganh?.tenDonViPhuTrach || sinhVien?.khoaNganh?.ten,
	identityNumber: sinhVien?.cccd,
	dateOfIssue: sinhVien?.ngayCapCccd,
	placeOfIssue: sinhVien?.noiCapCccd,
	nationality: sinhVien?.quocTich,
	permanentHomeAddress: getDiaChiThuongTru(sinhVien),
	emergencyContacts: getNguoiLienHeKhanCap(sinhVien),
});

const TRUONG_THONG_TIN_SINH_VIEN = [
	'fullName',
	'studentId',
	'dateOfBirth',
	'gender',
	'email',
	'phoneNumber',
	'program',
	'college',
	'identityNumber',
	'dateOfIssue',
	'placeOfIssue',
	'nationality',
	'permanentHomeAddress',
] as const;

type TTruongThongTinSinhVien = (typeof TRUONG_THONG_TIN_SINH_VIEN)[number];

const TRUONG_BUOC_THONG_TIN_CHUNG = [...TRUONG_THONG_TIN_SINH_VIEN, 'emergencyContacts'];

const isKhongCoThongTin = (value: unknown) =>
	value === undefined || value === null || (typeof value === 'string' && !value.trim());

const getTruongSinhVienDuocSua = (thongTinSinhVien: Partial<PhieuDangKyKTX.IDangKy>) =>
	TRUONG_THONG_TIN_SINH_VIEN.reduce<Partial<Record<TTruongThongTinSinhVien, boolean>>>((result, field) => {
		result[field] = isKhongCoThongTin(thongTinSinhVien[field]);
		return result;
	}, {});

const ModalDanKyKTX = (props: {
	getData?: () => void;
	daCoLichSuDangKy?: boolean;
	isView?: boolean;
	initialStep?: number;
}) => {
	const { getData, daCoLichSuDangKy, isView, initialStep = 0 } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const daDongYThongTinChung = Form.useWatch('checkbox1', form);
	const daDongYChinhSach = Form.useWatch('checkbox2', form);

	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { visibleDangKy, setVisibleDangKy, record: recPhong } = useModel('kytucxa.phong');
	const { record: recDot } = useModel('kytucxa.dotdangky');
	const { sinhVienDangKyKTXModel, formSubmiting, record: recPhieuDangKy } = useModel('kytucxa.phieudangky');

	const [currentStep, setCurrentStep] = useState<number>(0);
	const [visibleDangKyThanhCong, setVisibleDangKyThanhCong] = useState<boolean>(false);
	const [truongSinhVienDuocSua, setTruongSinhVienDuocSua] = useState<Partial<Record<TTruongThongTinSinhVien, boolean>>>(
		{},
	);

	const steps = [
		intl.formatMessage({ id: 'kytucxa.dangky.modal.step.thongTinChung' }),
		intl.formatMessage({ id: 'kytucxa.dangky.modal.step.liabilityWaiver' }),
		...(isView ? [intl.formatMessage({ id: 'kytucxa.dangky.modal.step.checkInPrep' })] : []),
	];
	const lastStep = steps.length - 1;

	useEffect(() => {
		if (visibleDangKy && isView) {
			setCurrentStep(Math.min(initialStep, lastStep));
			setTruongSinhVienDuocSua({});
			form.setFieldsValue({
				...recPhieuDangKy?.formDon,
				checkbox1: true,
				checkbox2: true,
			});
			return;
		}

		if (visibleDangKy && recSinhVien) {
			const thongTinSinhVien = getThongTinSinhVienForm(recSinhVien);
			form.setFieldsValue(thongTinSinhVien);
			setTruongSinhVienDuocSua(getTruongSinhVienDuocSua(thongTinSinhVien));
		}
	}, [visibleDangKy, isView, initialStep, lastStep, recSinhVien?._id, recPhieuDangKy?._id]);

	const handleClose = () => {
		form.resetFields();
		setCurrentStep(0);
		setTruongSinhVienDuocSua({});
		setVisibleDangKy(false);
	};

	const handleNext = async () => {
		try {
			await form.validateFields(TRUONG_BUOC_THONG_TIN_CHUNG);
			setCurrentStep(1);
		} catch (error) {
			console.error(error);
		}
	};

	const handleViewNext = () => {
		setCurrentStep((step) => Math.min(step + 1, lastStep));
	};

	const handleViewPrevious = () => {
		setCurrentStep((step) => Math.max(step - 1, 0));
	};

	const handleSubmit = async () => {
		if (isView) return;
		if (currentStep !== 1) return;
		if (daCoLichSuDangKy) {
			message.warning(intl.formatMessage({ id: 'kytucxa.dangky.message.daCoLichSu' }));
			handleClose();
			return;
		}

		try {
			const values = (await form.validateFields()) as PhieuDangKyKTX.IDangKy & {
				checkbox1?: boolean;
				checkbox2?: boolean;
			};
			const maPhong = recPhong?.room?.ma ?? recPhong?.roomId;
			const { checkbox1: _checkbox1, checkbox2: _checkbox2, ...formValues } = values;

			const data = {
				maDotId: recDot?._id,
				maPhong,
				form: {
					...formValues,
					agreedToPolicy: true,
				},
			};

		try {
			await sinhVienDangKyKTXModel(data as any, getData);

			handleClose();

			setVisibleDangKyThanhCong(true);
		} catch (error) {
			if (!getBeErrorMessage(error)) {
				message.error(intl.formatMessage({ id: 'kytucxa.dangky.message.loiKhongXacDinh' }));
			}
			getData?.();
		}
	};

	return (
		<>
			<ModalExpandable
				open={visibleDangKy}
				onCancel={handleClose}
				footer={null}
				width={1200}
				title={intl.formatMessage({ id: 'kytucxa.dangky.modal.title' })}
			>
				<Form layout='vertical' form={form} preserve>
					<Steps current={currentStep} onChange={isView ? setCurrentStep : undefined} style={{ marginBottom: 18 }}>
						{steps.map((title) => (
							<Steps.Step key={title} title={title} />
						))}
					</Steps>

					<hr
						style={{
							marginTop: 16,
							marginBottom: 16,
							border: 'none',
							borderTop: '2px solid #F4F4F4',
						}}
					/>

					<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
						<FormDangKyKTX form={form} disabled={isView} truongSinhVienDuocSua={truongSinhVienDuocSua} />
					</div>

					<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
						<FormChinhSachKTX form={form} disabled={isView} />
					</div>

					<div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
						<CheckInPrepContent />
					</div>

					<div className='form-footer'>
						{isView ? (
							<>
								{currentStep < lastStep ? (
									<Button htmlType='button' type='primary' onClick={handleViewNext}>
										{intl.formatMessage({ id: 'kytucxa.dangky.modal.button.next' })}
									</Button>
								) : null}

								{currentStep > 0 ? (
									<Button htmlType='button' onClick={handleViewPrevious}>
										{intl.formatMessage({ id: 'kytucxa.dangky.modal.button.previous' })}
									</Button>
								) : null}

								<Button htmlType='button' onClick={handleClose}>
									{intl.formatMessage({ id: 'activity.outcome.close' })}
								</Button>
							</>
						) : currentStep === 0 ? (
							<>
								<Button htmlType='button' type='primary' disabled={!daDongYThongTinChung} onClick={handleNext}>
									{intl.formatMessage({ id: 'kytucxa.dangky.modal.button.next' })}
								</Button>

								<Button htmlType='button' onClick={handleClose}>
									{intl.formatMessage({ id: 'activity.outcome.close' })}
								</Button>
							</>
						) : (
							<>
								<Button
									htmlType='button'
									type='primary'
									disabled={!daDongYChinhSach}
									loading={formSubmiting}
									onClick={handleSubmit}
								>
									{intl.formatMessage({ id: 'kytucxa.dangky.modal.button.submit' })}
								</Button>

								<Button htmlType='button' onClick={() => setCurrentStep(0)}>
									{intl.formatMessage({ id: 'kytucxa.dangky.modal.button.previous' })}
								</Button>
							</>
						)}
					</div>
				</Form>
			</ModalExpandable>

			<ModalExpandable
				open={visibleDangKyThanhCong}
				onCancel={() => setVisibleDangKyThanhCong(false)}
				footer={null}
				width={800}
				title={intl.formatMessage({ id: 'kytucxa.dangky.modal.success.title' })}
			>
				<CheckInPrepContent />

				<div className='form-footer'>
					<Button
						htmlType='button'
						type='primary'
						onClick={() => {
							setVisibleDangKyThanhCong(false);
							history.push('/finance/tuition-billing');
						}}
					>
						{intl.formatMessage({ id: 'kytucxa.dangky.card.button.paymentNow' })}
					</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default ModalDanKyKTX;
