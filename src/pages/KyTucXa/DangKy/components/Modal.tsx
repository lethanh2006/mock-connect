import ModalExpandable from '@/components/Table/ModalExpandable';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { Button, Form, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
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
});

const ModalDanKyKTX = (props: { getData?: () => void }) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { visibleDangKy, setVisibleDangKy, record: recPhong } = useModel('kytucxa.phong');
	const { record: recDot } = useModel('kytucxa.dotdangky');
	const { sinhVienDangKyKTXModel, formSubmiting } = useModel('kytucxa.phieudangky');

	const [currentStep, setCurrentStep] = useState<number>(0);

	const checkbox1: boolean = Form.useWatch('checkbox1', form);
	const checkbox2: boolean = Form.useWatch('checkbox2', form);

	useEffect(() => {
		if (visibleDangKy && recSinhVien) {
			form.setFieldsValue(getThongTinSinhVienForm(recSinhVien));
		}
	}, [visibleDangKy, recSinhVien?._id]);

	const handleClose = () => {
		form.resetFields();
		setCurrentStep(0);
		setVisibleDangKy(false);
	};

	const handleNext = async () => {
		try {
			await form.validateFields();
			setCurrentStep(1);
		} catch (error) {
			console.error(error);
		}
	};

	const onFinish = async (values: PhieuDangKyKTX.IDangKy & { checkbox1?: boolean; checkbox2?: boolean }) => {
		if (currentStep !== 1) return;

		const maPhong = recPhong?.room?.ma ?? recPhong?.roomId;

		const { checkbox1: _checkbox1, checkbox2: _checkbox2, ...formValues } = values;

		const data = {
			// maDotId: recDot?._id,
			maDotId: '6a4b8e6e39037d230762cb79',
			maPhong,
			form: {
				...formValues,
				agreedToPolicy: true,
			},
		};

		await sinhVienDangKyKTXModel(data as any, getData);

		handleClose();
	};

	return (
		<ModalExpandable open={visibleDangKy} onCancel={handleClose} footer={null} width={1000} title='Dormitory Detail'>
			<Form layout='vertical' onFinish={onFinish} form={form} preserve>
				<Steps current={currentStep} style={{ marginBottom: 18 }}>
					<Steps.Step title='Thông tin chung' />
					<Steps.Step title='Student Liability Release and Waiver' />
				</Steps>

				<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
					<FormDangKyKTX form={form} />
				</div>

				<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
					<FormChinhSachKTX form={form} />
				</div>

				<div className='form-footer'>
					{currentStep === 0 ? (
						<>
							<Button htmlType='button' disabled={!checkbox1} type='primary' onClick={handleNext}>
								Next
							</Button>

							<Button htmlType='button' onClick={handleClose}>
								{intl.formatMessage({ id: 'activity.outcome.close' })}
							</Button>
						</>
					) : (
						<>
							<Button disabled={!checkbox2} htmlType='submit' type='primary' loading={formSubmiting}>
								Submit
							</Button>

							<Button htmlType='button' onClick={() => setCurrentStep(0)}>
								Previous
							</Button>
						</>
					)}
				</div>
			</Form>
		</ModalExpandable>
	);
};

export default ModalDanKyKTX;
