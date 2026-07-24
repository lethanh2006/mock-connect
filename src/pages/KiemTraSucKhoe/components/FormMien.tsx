import UploadFile from '@/components/Upload/UploadFile';
import { EKtscReviewStatus, isRegisteredDeclarationType } from '@/services/KiemTraSucKhoe/constant';
import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { usePersonalInfo } from '../hooks/usePersonalInfo';
import PersonalInfoFields from './PersonalInfoFields';

interface IProps {
	record?: KiemTraSucKhoe.IDotDangKy;
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

/** Form khai báo miễn kiểm tra sức khỏe: thông tin cá nhân + tối đa 5 ảnh minh chứng */
const FormMienKiemTraSucKhoe = ({ record, isView, edit, onCancel, getData }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();
	const { postSinhVienMienKhamModel, putSinhVienMienKhamModel, setFormSubmiting, formSubmiting } =
		useModel('kiemtrasuckhoe.dotdangky');

	const studentRegistration = record?.student;
	const declarationType = record?.declarationType ?? studentRegistration?.declarationType;
	// Đã đăng ký vẫn cho phép sửa nếu cán bộ y tế yêu cầu bổ sung/chỉnh sửa hồ sơ (reviewStatus = CAN_BO_SUNG)
	const readOnly =
		!!isView ||
		(isRegisteredDeclarationType(declarationType) && record?.reviewStatus !== EKtscReviewStatus.CAN_BO_SUNG);

	const personalInfo = usePersonalInfo(studentRegistration, isView);

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
			proofFileIds: studentRegistration?.proofFileIds,
		});

		return () => resetFieldsForm(form);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [record?._id, personalInfo.recordSinhVien?._id]);

	const onFinish = async (values: any) => {
		if (readOnly || !record?.periodId) return;

		setFormSubmiting(true);
		// const proofFileIds = ((await buildUpLoadMultiFile(values, 'proofFileIds')) ?? []) as string[];
		setFormSubmiting(false);

		const payload: KiemTraSucKhoe.ISinhVienMienKham = {
			periodStudentId: personalInfo.recordSinhVien?.ssoId,
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
			proofFileIds: ['proofFileIds'],
		};

		if (edit) {
			await putSinhVienMienKhamModel(payload, getData);
		} else {
			await postSinhVienMienKhamModel(payload, getData);
		}
		onCancel();
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<PersonalInfoFields info={personalInfo} />

				<Col span={24}>
					<Form.Item
						name='proofFileIds'
						label={t('kiemtrasuckhoe.mien.minhChungKiemTraSucKhoe')}
						rules={[...rules.required]}
					>
						<UploadFile
							disabled={readOnly}
							maxCount={5}
							accept='.png,.jpg,.jpeg'
							maxFileSize={5}
							// buttonSize='middle'
							otherProps={{ multiple: true }}
						/>
					</Form.Item>
				</Col>
			</Row>
			<div className='form-footer'>
				{!readOnly ? (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{t(edit ? 'kiemtrasuckhoe.dangky.button.capNhat' : 'kiemtrasuckhoe.dangky.button.dangKy')}
					</Button>
				) : null}
				<Button htmlType='button' onClick={onCancel}>
					{t('global.button.huy')}
				</Button>
			</div>
		</Form>
	);
};

export default FormMienKiemTraSucKhoe;
