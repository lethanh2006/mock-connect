import { Button,  Form, Modal, Steps, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';
import dayjs from 'dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { KyTucXa } from '@/services/KyTucXa/typings';
import FormStep1Content from './FormStep1Content';
import FormStep2Content from './FormStep2Content';
import ModalSuccessRegistration from './ModalSuccessRegistration';

const FormDangKyKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: thongTinSinhVien, getThongTinSinhVienModel } = useModel('kytucxa.thongtinsinhvien');
	const { record: phong, visibleForm, setVisibleForm } = useModel('kytucxa.phong');
	const { record: dotDangKyRecord } = useModel('kytucxa.dotdangky');
	const { postModel, getModel: getLichSu, formSubmiting } = useModel('kytucxa.dangky');

	const [currentStep, setCurrentStep] = useState(0);
	const [visibleSuccess, setVisibleSuccess] = useState(false);

	useEffect(() => {
		if (visibleForm) {
			setCurrentStep(0);
			form.resetFields();
			getThongTinSinhVienModel().catch((err) => {
				console.error('Lỗi khi tải thông tin sinh viên:', err);
			});
		} else {
			resetFieldsForm(form);
		}
	}, [visibleForm, form]);

	useEffect(() => {
		if (visibleForm && thongTinSinhVien) {
			form.setFieldsValue({
				fullName: thongTinSinhVien.ten,
				studentId: thongTinSinhVien.ma,
				email: thongTinSinhVien.email,
				dateOfBirth: thongTinSinhVien.ngaySinh ? dayjs(thongTinSinhVien.ngaySinh).format('DD/MM/YYYY') : '-',
				gender: thongTinSinhVien.gioiTinh,
				program: thongTinSinhVien.nganh?.ten || '-',
				college: thongTinSinhVien.khoaSinhVien?.ten || '-',
				identityNumber: thongTinSinhVien.cccd || '-',
				dateOfIssue: thongTinSinhVien.ngayCapCccd ? dayjs(thongTinSinhVien.ngayCapCccd).format('DD/MM/YYYY') : '-',
				placeOfIssue: thongTinSinhVien.noiCapCccd || '-',
				phoneNumber: thongTinSinhVien.soDienThoai || '-',
				nationality: thongTinSinhVien.quocTich || '-',
				permanentHomeAddress: thongTinSinhVien.hoKhauThuongTru || '-',
				emergencyContacts: (() => {
					const validMembers = thongTinSinhVien.thanhVienGiaDinh?.filter(
						(m: KyTucXa.IThanhVienGiaDinh) => m.ten || m.hoDem || m.soDienThoai || m.loaiThanhVien
					) || [];
					
					return validMembers.length > 0
						? validMembers.map((member: KyTucXa.IThanhVienGiaDinh, index: number) => ({
							id: Date.now().toString() + index,
							emergencyContactName: `${member.hoDem || ''} ${member.ten || ''}`.trim() || '',
							emergencyContactNumber: member.soDienThoai || '',
							emergencyRelationship: member.loaiThanhVien || '',
							secondaryContactNumber: member.soDienThoai || '',
							emergencyEmail: member.email || '',
							address: member.diaChiHienNay?.diaChi || member.hoKhauThuongTru?.diaChi || thongTinSinhVien.hoKhauThuongTru || '',
						}))
						: [];
				})(),
			});
		}
	}, [thongTinSinhVien, visibleForm, form]);

	const handleNext = async () => {
		try {
			await form.validateFields(['fullName', 'studentId', 'dateOfBirth', 'email', 'phoneNumber', 'apid', 'college', 'identityNumber', 'dateOfIssue', 'placeOfIssue', 'nationality', 'emergencyContacts', 'confirmInfo']);
			setCurrentStep(1);
			setTimeout(() => {
				const scrollContainer = document.querySelector('.ant-modal-wrap');
				if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
			}, 100);
		} catch (error: any) {
			if (error?.errorFields && error.errorFields.length > 0) {
				form.scrollToField(error.errorFields[0].name, { behavior: 'smooth', block: 'center' });
			}
		}
	};

	const handleReloadEmergencyContacts = async () => {
		try {
			const newData = await getThongTinSinhVienModel();
			const familyMembers = newData?.thanhVienGiaDinh?.filter(
				(m: KyTucXa.IThanhVienGiaDinh) => m.ten || m.hoDem || m.soDienThoai || m.loaiThanhVien
			) || [];
			
			form.setFieldsValue({
				emergencyContacts: familyMembers.length > 0 
					? familyMembers.map((member: KyTucXa.IThanhVienGiaDinh, index: number) => ({
						id: Date.now().toString() + index,
						emergencyContactName: `${member.hoDem || ''} ${member.ten || ''}`.trim() || '',
						emergencyContactNumber: member.soDienThoai || '',
						emergencyRelationship: member.loaiThanhVien || '',
						secondaryContactNumber:  member.soDienThoai || '',
						emergencyEmail: member.email || '',
						address: member.diaChiHienNay?.diaChi || member.hoKhauThuongTru?.diaChi || '',
					}))
					: []
			});
		} catch (error) {
			console.error('Lỗi khi tải lại thông tin sinh viên:', error);
		}
	};

	const handlePrevious = () => {
		setCurrentStep(0);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (!values.confirmTerms) {
				message.error(intl.formatMessage({ id: 'kytucxa.dangky.form.msg.agreeTerms' }));
				return;
			}

			const { confirmTerms, ...rest } = values as { confirmTerms: boolean } & KyTucXa.IFormDangKy;

			const dateOfBirthISO = rest.dateOfBirth
				? dayjs(rest.dateOfBirth, 'DD/MM/YYYY').toISOString()
				: '';

			const payload = {
				maDotId: dotDangKyRecord?._id,
				maPhong: phong?.ma,
				form: {
					fullName: rest.fullName,
					studentId: rest.studentId,
					dateOfBirth: dateOfBirthISO,
					gender: rest.gender,
					email: rest.email,
					phoneNumber: rest.phoneNumber,
					program: rest.program,
					college: rest.college,
					identityNumber: rest.identityNumber,
					dateOfIssue: rest.dateOfIssue,
					placeOfIssue: rest.placeOfIssue,
					nationality: rest.nationality,
					permanentHomeAddress: rest.permanentHomeAddress,
					emergencyContacts: rest.emergencyContacts,
				},
			};

			await postModel(payload, getLichSu, undefined, intl.formatMessage({ id: 'kytucxa.dangky.form.msg.registerSuccess' }));
			setVisibleForm(false);
			setVisibleSuccess(true);
		} catch (error: any) {
			console.log(error);
			if (error?.errorFields && error.errorFields.length > 0) {
				form.scrollToField(error.errorFields[0].name, { behavior: 'smooth', block: 'center' });
			}
		}
	};

	return (
		<>
			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={1000}
				destroyOnClose
				className='ktx-register-modal'
				title={intl.formatMessage({ id: 'kytucxa.dangky.form.title' })}
			>
				<div className="ktx-modal__content">
					<Steps
						current={currentStep}
						className={`ktx-register-steps ${currentStep === 1 ? 'step2-active' : ''}`}
						size="small"
						items={[
							{
								title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.generalInfo' }),
								status: 'finish'
							},
							{
								title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' }),
								status: currentStep === 1 ? 'finish' : 'wait'
							},
						]}
					/>

					<Form form={form} layout="vertical" preserve={true} className="ktx-register-form">
						<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
							<FormStep1Content 
								showCheckbox={true} 
								disabled={false} 
								onReload={handleReloadEmergencyContacts} 
							/>
						</div>


						<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
							<FormStep2Content showCheckbox={true} />
						</div>
					</Form>

					<div className="ktx-modal__footer ktx-register-footer">
						{currentStep === 0 && (
							<>
								<Button size="large" onClick={() => setVisibleForm(false)} className="ktx-register-btn-outline">{intl.formatMessage({ id: 'kytucxa.dangky.form.close' })}</Button>
								<Button type="primary" size="large" onClick={handleNext} className="ktx-register-btn-primary">{intl.formatMessage({ id: 'kytucxa.dangky.form.next' })}</Button>
							</>
						)}
						{currentStep === 1 && (
							<>
								<Button size="large" onClick={handlePrevious} className="ktx-register-btn-outline">{intl.formatMessage({ id: 'kytucxa.dangky.form.previous' })}</Button>
								<Button type="primary" size="large" onClick={handleSubmit} loading={formSubmiting} className="ktx-register-btn-primary">{intl.formatMessage({ id: 'kytucxa.dangky.form.submit' })}</Button>
							</>
						)}
					</div>
				</div>
			</Modal>
			<ModalSuccessRegistration open={visibleSuccess} onClose={() => setVisibleSuccess(false)} phong={phong} />
		</>
	);
};

export default FormDangKyKTX;