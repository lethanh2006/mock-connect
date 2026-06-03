import { Button, Checkbox, Col, Form, Input, Modal, Row, Steps, Typography, message, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';
import dayjs from 'dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';
import rules from '@/utils/rules';
import TableEmergencyContact from './TableEmergencyContact';

const { TextArea } = Input;

const FormDangKyKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: thongTinSinhVien, getThongTinSinhVienModel } = useModel('kytucxa.thongtinsinhvien');
	const { record: phong, visibleForm, setVisibleForm } = useModel('kytucxa.phong');
	const { record: dotDangKyRecord } = useModel('kytucxa.dotdangky');
	const { postModel, getModel: getLichSu, formSubmiting } = useModel('kytucxa.dangky');

	const [currentStep, setCurrentStep] = useState(0);

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
				emergencyContacts: [{
					id: Date.now().toString(),
					emergencyContactName: thongTinSinhVien.nguoiLienLac || '-',
					emergencyContactNumber: thongTinSinhVien.soDienThoaiNguoiLienLac || '-',
					emergencyRelationship: thongTinSinhVien.thanhVienGiaDinh || '-', 
					secondaryContactNumber: '-',
					emergencyEmail: '-',
					address: thongTinSinhVien.hoKhauThuongTru || '-',
				}],
			});
		}
	}, [thongTinSinhVien, visibleForm, form]);

	const handleNext = async () => {
		try {
			await form.validateFields(['fullName', 'studentId', 'dateOfBirth', 'email', 'phoneNumber', 'apid', 'college', 'identityNumber', 'dateOfIssue', 'placeOfIssue', 'nationality', 'emergencyContacts']);
			setCurrentStep(1);
		} catch (error) { }
	};

	const handleReloadEmergencyContacts = async () => {
		try {
			await getThongTinSinhVienModel();
			form.setFieldsValue({
				emergencyContacts: [{
					id: Date.now().toString(),
					emergencyContactName: thongTinSinhVien?.nguoiLienLac || '-',
					emergencyContactNumber: thongTinSinhVien?.soDienThoaiNguoiLienLac || '-',
					emergencyRelationship: thongTinSinhVien?.thanhVienGiaDinh || '-', 
					secondaryContactNumber: '-',
					emergencyEmail: '-',
					address: thongTinSinhVien?.hoKhauThuongTru || '-',
				}]
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

			const { confirmTerms, ...rest } = values as { confirmTerms: boolean } & DangKyKyTucXa.IFormDangKyKTX & { specialRequirements?: string };

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
					haveHealthInsurance: !!rest.haveHealthInsurance,
					emergencyContacts: rest.emergencyContacts,
				},
			};

			await postModel(payload, getLichSu, undefined, intl.formatMessage({ id: 'kytucxa.dangky.form.msg.registerSuccess' }));
			setVisibleForm(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
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
							<div className="ktx-register-section">
								<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.terms' })}</Typography.Title>
								<div className="ktx-register-section__content">
									<div className="ktx-terms-content">
										<ol className="ktx-terms-list">
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.1' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.2' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.3' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.4' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.5' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.6' })}</li>
										</ol>
									</div>
								</div>
							</div>

							<div className="ktx-register-section">
								<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.studentInfo' })}</Typography.Title>
								<div className="ktx-register-section__content">
									<Row gutter={16}>
										<Col xs={24} md={12}>
											<Form.Item name="fullName" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.fullName' })}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="studentId" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.studentId' })}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="dateOfBirth" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfBirth' })}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="gender" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.gender' })}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="email" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email' })} rules={[{ required: true }]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="phoneNumber" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.phoneNumber' })} rules={[...rules.required]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="program" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.program' })} rules={[{ required: true }]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="college" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.college' })} rules={[{ required: true }]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="identityNumber" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityNumber' })} rules={[...rules.required]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={12}>
											<Form.Item name="dateOfIssue" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfIssue' })} rules={[...rules.required]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={24}>
											<Form.Item name="placeOfIssue" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.placeOfIssue' })} rules={[...rules.required]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24}>
											<Form.Item name="nationality" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality' })} rules={[...rules.required]}>
												<Input disabled />
											</Form.Item>
										</Col>
										<Col xs={24} md={24}>
											<Form.Item name="permanentHomeAddress" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.permanentHomeAddress' })} rules={[...rules.required]}>
												<TextArea rows={2} disabled />
											</Form.Item>
										</Col>
									</Row>
								</div>
							</div>

							<div className="ktx-register-section mt-4">
								<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.emergencyContact' })}</Typography.Title>
								<div className="ktx-register-section__content">
									<Form.Item 
										name="emergencyContacts" 
										rules={[
											{ required: true },
											{
												validator: (_, value) => {
													if (!value || value.length < 2) {
														return Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.msg.min2Contacts' })));
													}
													return Promise.resolve();
												}
											}
										]}
									>
										<TableEmergencyContact onReload={handleReloadEmergencyContacts} />
									</Form.Item>
								</div>
							</div>
					</div>


					<div className="ktx-step2-wrapper" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
							<div className="ktx-register-section">
								<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' })}</Typography.Title>
								<div className="ktx-register-section__content">
									<div className="ktx-terms-content">
										<p className="fw-500" style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.warning' })}</p>
										<ol className="ktx-terms-list">
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.1' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.2' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.3' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.4' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.5' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.6' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.7' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.8' })}</li>
											<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.9' })}</li>
										</ol>
									</div>
								</div>
							</div>

							<div className="ktx-register-section mt-4">
								<div className="ktx-register-section__content">
									<Form.Item name="confirmTerms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.form.msg.mustAgree' }))) }]}>
										<Checkbox className="ktx-confirm-checkbox">
											<span className="ktx-confirm-text">
												{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmText' })}
											</span>
										</Checkbox>
									</Form.Item>
								</div>
							</div>
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
	);
};

export default FormDangKyKTX;