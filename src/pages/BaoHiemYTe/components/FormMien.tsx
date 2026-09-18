import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import UploadFile from '@/components/Upload/UploadFile';
import {
	doiTuongThamGiaBHYTIntlId,
	EBhytReviewStatus,
	EDoiTuongThamGiaBHYT,
	isRegisteredDeclarationType,
} from '@/services/BaoHiemYTe/constant';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { buildUpLoadFileMultipart, EFileScope } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { Col, Row } from '@/components/MyGrid';
import Input from '@/components/MyInput';
import Select from '@/components/MySelect';
import { Button, Divider, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { usePersonalInfo } from '../hooks/usePersonalInfo';
import PersonalInfoFields from './PersonalInfoFields';
import { resetFieldsForm } from '@/utils/utils';

interface IProps {
	record?: BaoHiemYTe.IDotDangKy;
	isView?: boolean;
	edit?: boolean;
	onCancel: () => void;
	getData?: () => void;
}

const parseDate = (value?: string | null) => {
	if (!value) return null;

	const parsed = dayjs(value);
	if (parsed.isValid()) return parsed;

	const parsedVietnameseDate = dayjs(value, 'DD/MM/YYYY', true);
	return parsedVietnameseDate.isValid() ? parsedVietnameseDate : null;
};

/** Form khai báo đã có bảo hiểm y tế bên ngoài (upload minh chứng) */
const FormMienBHYT = ({ record, isView, edit, onCancel, getData }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();
	const { postSinhVienDangKyTuChonModel, putSinhVienDangKyTuChonModel, setFormSubmiting, formSubmiting } =
		useModel('baohiemyte.dotdangky');

	const studentRegistration = record?.student;
	const declarationType = record?.declarationType ?? studentRegistration?.declarationType;
	// Đã đăng ký vẫn cho phép sửa nếu cán bộ y tế yêu cầu bổ sung/chỉnh sửa hồ sơ (reviewStatus = CAN_BO_SUNG)
	const readOnly =
		!!isView ||
		(isRegisteredDeclarationType(declarationType) && record?.reviewStatus !== EBhytReviewStatus.CAN_BO_SUNG);

	const personalInfo = usePersonalInfo(studentRegistration, isView, form);
	const { isVN, passportImageFileId, visaImageFileId } = personalInfo;

	const doiTuongThamGiaBHYTOptions = Object.values(EDoiTuongThamGiaBHYT).map((value) => ({
		value,
		label: t(doiTuongThamGiaBHYTIntlId[value]),
	}));

	useEffect(() => {
		form.setFieldsValue({
			fullName: personalInfo.studentFullName,
			studentCode: personalInfo.studentCode,
			ngaySinh: parseDate(personalInfo.studentNgaySinh),
			cccd: personalInfo.studentCccd,
			nationality: personalInfo.studentNationality,
			gioiTinh: personalInfo.studentGioiTinh,
			khoa: personalInfo.studentKhoa,
			nganh: personalInfo.studentNganh,
			phone: personalInfo.studentPhone,
			email: personalInfo.studentEmail,
			ssnNumber: studentRegistration?.ssnNumber,
			cardNumber: studentRegistration?.cardNumber,
			cardExpiredAt: parseDate(studentRegistration?.cardExpiredAt),
			participantGroup: studentRegistration?.participantGroup,
			initialClinicPlace: studentRegistration?.initialClinicPlace,
			passportImageFileId,
			visaImageFileId,
			insuranceProviderName: studentRegistration?.insuranceProviderName,
			insuranceCardNumber: studentRegistration?.insuranceCardNumber,
			hanBaoHiemRange:
				studentRegistration?.insuranceValidFrom || studentRegistration?.insuranceValidTo
					? [parseDate(studentRegistration?.insuranceValidFrom), parseDate(studentRegistration?.insuranceValidTo)]
					: undefined,
			proofFileId: studentRegistration?.proofFileId,
		});

		return () => resetFieldsForm(form);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [record?._id, personalInfo.recordSinhVien?._id]);

	const onFinish = async (values: any) => {
		if (readOnly || !record?.periodId) return;

		setFormSubmiting(true);
		try {
			const [insuranceValidFrom, insuranceValidTo] = values.hanBaoHiemRange || [];
			const [uploadedPassportImageFileId, uploadedVisaImageFileId, uploadedProofFileId] = await Promise.all([
				buildUpLoadFileMultipart(values, 'passportImageFileId', {
					scope: EFileScope.INTERNAL,
					module: 'bao-hiem-y-te',
					returnValue: 'url',
				}),
				buildUpLoadFileMultipart(values, 'visaImageFileId', {
					scope: EFileScope.INTERNAL,
					module: 'bao-hiem-y-te',
					returnValue: 'url',
				}),
				buildUpLoadFileMultipart(values, 'proofFileId', {
					scope: EFileScope.INTERNAL,
					module: 'bao-hiem-y-te',
					returnValue: 'url',
				}),
			]);

			const payload: BaoHiemYTe.ISinhVienDangKy = {
				studentId: personalInfo.recordSinhVien?.ssoId,
				periodStudentId: record.periodStudentId,
				periodId: record.periodId,
				fullName: values.fullName,
				studentCode: values.studentCode,
				ngaySinh: values.ngaySinh ? dayjs(values.ngaySinh).toISOString() : undefined,
				cccd: values.cccd,
				nationality: values.nationality,
				gioiTinh: values.gioiTinh,
				khoa: values.khoa,
				nganh: values.nganh,
				maKhoa: personalInfo.studentMaKhoa,
				maNganh: personalInfo.studentMaNganh,
				phone: values.phone,
				email: values.email,
				proofFileId: uploadedProofFileId ?? studentRegistration?.proofFileId,
				ssnNumber: values.ssnNumber,
				cardNumber: values.cardNumber,
				cardExpiredAt: values.cardExpiredAt,
				participantGroup: values.participantGroup,
				initialClinicPlace: values.initialClinicPlace,
				passportImageFileId: uploadedPassportImageFileId ?? passportImageFileId,
				visaImageFileId: uploadedVisaImageFileId ?? visaImageFileId,
				insuranceProviderName: values.insuranceProviderName,
				insuranceCardNumber: values.insuranceCardNumber,
				insuranceValidFrom,
				insuranceValidTo,
			};

			if (edit) {
				await putSinhVienDangKyTuChonModel(payload, getData);
			} else {
				await postSinhVienDangKyTuChonModel(payload, getData);
			}
			onCancel();
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
						{t('baohiemyte.mien.thongTinSinhVien')}
					</Divider>
				</Col>
				<PersonalInfoFields info={personalInfo} />

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
						{t('baohiemyte.mien.thongTinBaoHiem')}
					</Divider>
				</Col>
				{isVN ? (
					<>
						<Col span={24} md={12}>
							<Form.Item
								name='ssnNumber'
								label={t('baohiemyte.mien.soBHXH')}
								rules={[...rules.required, ...rules.text]}
							>
								<Input disabled={readOnly} placeholder={t('baohiemyte.mien.nhapSoBHXH')} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='cardNumber'
								label={t('baohiemyte.mien.soTheBaoHiem')}
								rules={[...rules.required, ...rules.text]}
							>
								<Input disabled={readOnly} placeholder={t('baohiemyte.mien.nhapSoTheBaoHiem')} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='cardExpiredAt' label={t('baohiemyte.mien.hanBaoHiem')} rules={[...rules.required]}>
								<MyDatePicker
									disabled={readOnly}
									format='DD/MM/YYYY'
									placeholder={t('baohiemyte.mien.placeholder.select')}
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='participantGroup'
								label={t('baohiemyte.mien.doiTuongThamGiaBHYT')}
								rules={[...rules.required]}
							>
								<Select
									disabled={readOnly}
									options={doiTuongThamGiaBHYTOptions}
									placeholder={t('baohiemyte.mien.placeholder.select')}
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='initialClinicPlace'
								label={t('baohiemyte.mien.noiDangKyKCBBanDau')}
								rules={[...rules.required, ...rules.text]}
							>
								<Input disabled={readOnly} placeholder={t('baohiemyte.mien.nhapNoiDangKyKCBBanDau')} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='proofFileId' label={t('baohiemyte.mien.uploadTheBaoHiem')} rules={[...rules.required]}>
								<UploadFile
									disabled={readOnly}
									maxCount={1}
									accept='.pdf, .png, .jpg, .jpeg'
									maxFileSize={5}
									buttonSize='middle'
								/>
							</Form.Item>
						</Col>
					</>
				) : (
					<>
						{readOnly || !passportImageFileId ? (
							<Col span={24} md={12}>
								<Form.Item name='passportImageFileId' label={t('baohiemyte.mien.hoChieu')} rules={[...rules.required]}>
									<UploadFile
										disabled={readOnly}
										maxCount={1}
										accept='.pdf, .png, .jpg, .jpeg'
										maxFileSize={5}
										buttonSize='middle'
									/>
								</Form.Item>
							</Col>
						) : null}
						{readOnly || !visaImageFileId ? (
							<Col span={24} md={12}>
								<Form.Item
									name='visaImageFileId'
									label={t('baohiemyte.mien.visaTheTamTru')}
									rules={[...rules.required]}
								>
									<UploadFile
										disabled={readOnly}
										maxCount={1}
										accept='.pdf, .png, .jpg, .jpeg'
										maxFileSize={5}
										buttonSize='middle'
									/>
								</Form.Item>
							</Col>
						) : null}
						<Col span={24} md={12}>
							<Form.Item
								name='insuranceProviderName'
								label={t('baohiemyte.mien.tenDonViBaoHiem')}
								rules={[...rules.required, ...rules.text]}
							>
								<Input disabled={readOnly} placeholder={t('baohiemyte.mien.nhapTenDonViBaoHiem')} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='insuranceCardNumber'
								label={t('baohiemyte.mien.soTheBaoHiemNuocNgoai')}
								rules={[...rules.required, ...rules.text]}
							>
								<Input disabled={readOnly} placeholder={t('baohiemyte.mien.nhapSoTheBaoHiem')} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='hanBaoHiemRange'
								label={t('baohiemyte.mien.hanBaoHiemRange')}
								rules={[...rules.required]}
							>
								<MyDateRangePicker disabled={readOnly} format='DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='proofFileId'
								label={t('baohiemyte.mien.minhChungBaoHiemHopLe')}
								rules={[...rules.required]}
							>
								<UploadFile
									disabled={readOnly}
									maxCount={1}
									accept='.pdf, .png, .jpg, .jpeg'
									maxFileSize={5}
									buttonSize='middle'
								/>
							</Form.Item>
						</Col>
					</>
				)}
			</Row>
			<div className='form-footer'>
				{!readOnly ? (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{t(edit ? 'baohiemyte.dangky.button.capNhat' : 'baohiemyte.dangky.button.dangKy')}
					</Button>
				) : null}
				<Button htmlType='button' onClick={onCancel}>
					{t('global.button.huy')}
				</Button>
			</div>
		</Form>
	);
};

export default FormMienBHYT;
