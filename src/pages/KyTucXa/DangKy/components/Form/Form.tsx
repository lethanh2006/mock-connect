import { KyTucXa } from '@/services/KyTucXa/typings';
import { EFileScope, buildUpLoadFile, uploadFile } from '@/services/uploadFile';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Modal, Steps, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalSuccessRegistration from '../Modal/ModalSuccessRegistration';
import '../style.less';
import FormStep1Content from './FormStep1Content';
import FormStep2Content from './FormStep2Content';

const FormDangKyKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: phong, visibleForm, setVisibleForm } = useModel('kytucxa.phong');
	const { record: dotDangKyRecord } = useModel('kytucxa.dotdangky');
	const { postModel, getModel: getLichSu, formSubmiting } = useModel('kytucxa.dangky');

	const [currentStep, setCurrentStep] = useState(0);
	const [visibleSuccess, setVisibleSuccess] = useState(false);
	const [policyText, setPolicyText] = useState<string>('');

	useEffect(() => {
		if (visibleForm) {
			setCurrentStep(0);
			form.resetFields();

			const loadPolicy = async () => {
				try {
					const res = await axios.get(`${ipCsvc}/setting/DANG_KY_KY_TUC_XA_POLICY/value`);
					if (res?.data?.data) {
						setPolicyText(res.data.data);
						return;
					}
				} catch (e) {
					console.log('Failed to fetch DANG_KY_KY_TUC_XA_POLICY, trying SettingDangKyKyTucXa.policy...');
				}
				try {
					const res = await axios.get(`${ipCsvc}/setting/SettingDangKyKyTucXa.policy/value`);
					if (res?.data?.data) {
						setPolicyText(res.data.data);
					}
				} catch (e) {
					console.log('Failed to fetch SettingDangKyKyTucXa.policy');
				}
			};
			loadPolicy();
		} else {
			resetFieldsForm(form);
		}
	}, [visibleForm, form]);

	useEffect(() => {
		if (visibleForm && recSinhVien?.ssoId) {
			form.setFieldsValue({
				fullName: recSinhVien.ten,
				studentId: recSinhVien.ma,
				email: recSinhVien.email,
				dateOfBirth: recSinhVien.ngaySinh ? dayjs(recSinhVien.ngaySinh).format('DD/MM/YYYY') : '-',
				gender: recSinhVien.gioiTinh,
				program: recSinhVien.nganh?.ten || '-',
				college: recSinhVien.khoaSinhVien?.ten || '-',
				identityNumber: recSinhVien.cccd || '-',
				dateOfIssue: recSinhVien.ngayCapCccd ? dayjs(recSinhVien.ngayCapCccd).format('DD/MM/YYYY') : '-',
				placeOfIssue: recSinhVien.noiCapCccd || '-',
				phoneNumber: recSinhVien.soDienThoai || '-',
				nationality: recSinhVien.quocTich || '-',
				permanentHomeAddress: recSinhVien.hoKhauThuongTru || '-',
				// emergencyContacts: (() => {
				// 	const validMembers =
				// 		recSinhVien.thanhVienGiaDinh?.filter(
				// 			(m: KyTucXa.IThanhVienGiaDinh) => m.ten || m.hoDem || m.soDienThoai || m.loaiThanhVien,
				// 		) || [];

				// 	return validMembers.length > 0
				// 		? validMembers.map((member: KyTucXa.IThanhVienGiaDinh, index: number) => ({
				// 				id: Date.now().toString() + index,
				// 				emergencyContactName: `${member.hoDem || ''} ${member.ten || ''}`.trim() || '',
				// 				emergencyContactNumber: member.soDienThoai || '',
				// 				emergencyRelationship: member.loaiThanhVien || '',
				// 				secondaryContactNumber: member.soDienThoai || '',
				// 				emergencyEmail: member.email || '',
				// 				address:
				// 					member.diaChiHienNay?.diaChi || member.hoKhauThuongTru?.diaChi || recSinhVien.hoKhauThuongTru || '',
				// 			}))
				// 		: [];
				// })(),
			});
		}
	}, [recSinhVien, visibleForm, form]);

	const handleNext = async () => {
		try {
			await form.validateFields([
				'fullName',
				'studentId',
				'dateOfBirth',
				'email',
				'phoneNumber',
				'college',
				'identityNumber',
				'dateOfIssue',
				'placeOfIssue',
				'nationality',
				'emergencyContacts',
				'confirmInfo',
				'identityCardFrontUrl',
				'identityCardBackUrl',
				'passportUrl',
				'haveHealthInsurance',
				'healthInsuranceFile',
				'hasSpecialCondition',
				'conditionDetails',
			]);
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
		// try {
		// 	const familyMembers =
		// 		recSinhVien?.thanhVienGiaDinh?.filter(
		// 			(m: KyTucXa.IThanhVienGiaDinh) => m.ten || m.hoDem || m.soDienThoai || m.loaiThanhVien,
		// 		) || [];
		// 	form.setFieldsValue({
		// 		emergencyContacts:
		// 			familyMembers.length > 0
		// 				? familyMembers.map((member: KyTucXa.IThanhVienGiaDinh, index: number) => ({
		// 						id: Date.now().toString() + index,
		// 						emergencyContactName: `${member.hoDem || ''} ${member.ten || ''}`.trim() || '',
		// 						emergencyContactNumber: member.soDienThoai || '',
		// 						emergencyRelationship: member.loaiThanhVien || '',
		// 						secondaryContactNumber: member.soDienThoai || '',
		// 						emergencyEmail: member.email || '',
		// 						address: member.diaChiHienNay?.diaChi || member.hoKhauThuongTru?.diaChi || '',
		// 					}))
		// 				: [],
		// 	});
		// } catch (error) {
		// 	console.error('Lỗi khi tải lại thông tin sinh viên:', error);
		// }
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

			const { confirmTerms, ...rest } = values as { confirmTerms: boolean } & KyTucXa.IFormDangKy & {
					signatureBase64?: string;
				};

			const dateOfBirthISO = rest.dateOfBirth ? dayjs(rest.dateOfBirth, 'DD/MM/YYYY').toISOString() : '';

			// 1. Upload files
			const identityCardFrontUrl = await buildUpLoadFile(values, 'identityCardFrontUrl').catch(console.log);
			const identityCardBackUrl = await buildUpLoadFile(values, 'identityCardBackUrl').catch(console.log);
			const passportUrl = await buildUpLoadFile(values, 'passportUrl').catch(console.log);
			const healthInsuranceFile = await buildUpLoadFile(values, 'healthInsuranceFile').catch(console.log);

			// 2. Convert base64 signature to Blob and upload
			let signatureUrl = '';
			if (values.signatureBase64) {
				try {
					const dataURLtoBlob = (dataurl: string) => {
						const arr = dataurl.split(',');
						const mime = arr[0].match(/:(.*?);/)?.[1];
						const bstr = atob(arr[1]);
						let n = bstr.length;
						const u8arr = new Uint8Array(n);
						while (n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						return new Blob([u8arr], { type: mime });
					};
					const signatureBlob = dataURLtoBlob(values.signatureBase64);
					const signatureRes = await uploadFile({ file: signatureBlob, scope: EFileScope.PUBLIC });
					signatureUrl = signatureRes?.data?.data?.url || '';
				} catch (err) {
					console.error('Lỗi khi tải lên chữ ký:', err);
					message.error('Lỗi khi lưu chữ ký, vui lòng thử lại');
					return;
				}
			}

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
					identityCardFrontUrl: identityCardFrontUrl || undefined,
					identityCardBackUrl: identityCardBackUrl || undefined,
					passportUrl: passportUrl || undefined,
					agreedToPolicy: true,
					signatureUrl: signatureUrl || undefined,
					hasSpecialCondition: !!rest.hasSpecialCondition,
					conditionDetails: rest.conditionDetails || undefined,
					haveHealthInsurance: !!rest.haveHealthInsurance,
					healthInsuranceFile: healthInsuranceFile || undefined,
				},
			};

			await postModel(
				payload,
				getLichSu,
				undefined,
				intl.formatMessage({ id: 'kytucxa.dangky.form.msg.registerSuccess' }),
			);
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
				<div className='ktx-modal__content'>
					<Steps
						current={currentStep}
						className={`ktx-register-steps ${currentStep === 1 ? 'step2-active' : ''}`}
						size='small'
						items={[
							{
								title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.generalInfo' }),
								status: 'finish',
							},
							{
								title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' }),
								status: currentStep === 1 ? 'finish' : 'wait',
							},
						]}
					/>

					<Form form={form} layout='vertical' preserve={true} className='ktx-register-form'>
						<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
							<FormStep1Content
								showCheckbox={true}
								disabled={false}
								onReload={handleReloadEmergencyContacts}
								policyText={policyText}
							/>
						</div>

						<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
							<FormStep2Content showCheckbox={true} policyText={policyText} />
						</div>
					</Form>

					<div className='ktx-modal__footer ktx-register-footer'>
						{currentStep === 0 && (
							<>
								<Button size='large' onClick={() => setVisibleForm(false)} className='ktx-register-btn-outline'>
									{intl.formatMessage({ id: 'kytucxa.dangky.form.close' })}
								</Button>
								<Button type='primary' size='large' onClick={handleNext} className='ktx-register-btn-primary'>
									{intl.formatMessage({ id: 'kytucxa.dangky.form.next' })}
								</Button>
							</>
						)}
						{currentStep === 1 && (
							<>
								<Button size='large' onClick={handlePrevious} className='ktx-register-btn-outline'>
									{intl.formatMessage({ id: 'kytucxa.dangky.form.previous' })}
								</Button>
								<Button
									type='primary'
									size='large'
									onClick={handleSubmit}
									loading={formSubmiting}
									className='ktx-register-btn-primary'
								>
									{intl.formatMessage({ id: 'kytucxa.dangky.form.submit' })}
								</Button>
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
