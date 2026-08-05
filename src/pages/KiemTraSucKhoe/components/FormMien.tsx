import UploadFile from '@/components/Upload/UploadFile';
import { EKtscReviewStatus, isRegisteredDeclarationType } from '@/services/KiemTraSucKhoe/constant';
import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import { buildUpLoadMultiFileMultipart, EFileScope } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { usePersonalInfo } from '../hooks/usePersonalInfo';

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

	const personalInfo = usePersonalInfo(studentRegistration, isView, form);

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
		try {
			const proofFileIds = ((await buildUpLoadMultiFileMultipart(values, 'proofFileIds', {
				scope: EFileScope.INTERNAL,
				module: 'kham-suc-khoe',
				returnValue: 'url',
			})) ?? []) as string[];

			if (edit) {
				const payload: KiemTraSucKhoe.ISinhVienMienKham = {
					ssoId: personalInfo.recordSinhVien?.ssoId,
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
					proofFileIds: proofFileIds,
				};

				await putSinhVienMienKhamModel(payload, getData);
			} else {
				// Tạo mới: lấy toàn bộ thông tin sinh viên từ recordSinhVien (dữ liệu hệ thống), không lấy từ form
				const recordSinhVien = personalInfo.recordSinhVien as any;
				const payload: KiemTraSucKhoe.ISinhVienMienKham = {
					ssoId: recordSinhVien?.ssoId,
					studentId: recordSinhVien?.ssoId,
					periodStudentId: record.periodStudentId,
					periodId: record.periodId,
					fullName: recordSinhVien?.ten,
					studentCode: recordSinhVien?.ma,
					ngaySinh: recordSinhVien?.ngaySinh,
					cccd: recordSinhVien?.cccd,
					nationality: recordSinhVien?.quocTich,
					gioiTinh: recordSinhVien?.gioiTinh,
					khoa: recordSinhVien?.khoaSinhVien?.ten,
					nganh: recordSinhVien?.nganh?.ten,
					maKhoa: recordSinhVien?.maKhoaSinhVien,
					maNganh: recordSinhVien?.maNganh,
					phone: recordSinhVien?.soDienThoai,
					email: recordSinhVien?.email,
					proofFileIds: proofFileIds,
				};

				await postSinhVienMienKhamModel(payload, getData);
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
					<Form.Item
						name='proofFileIds'
						label={t('kiemtrasuckhoe.mien.minhChungKiemTraSucKhoe')}
						rules={[...rules.required]}
					>
						<UploadFile
							disabled={readOnly}
							maxCount={5}
							accept='.pdf, .png, .jpg, .jpeg'
							maxFileSize={5}
							buttonSize='middle'
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
