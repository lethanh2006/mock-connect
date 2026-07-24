import MyDatePicker from '@/components/MyDatePicker';
import { EBhytNationality, isRegisteredDeclarationType } from '@/services/BaoHiemYTe/constant';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { usePersonalInfo } from '../hooks/usePersonalInfo';
import PersonalInfoFields from './PersonalInfoFields';

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

/** Form đăng ký bảo hiểm y tế qua trường (sinh viên chưa có BHYT) */
const FormDangKyBHYT = ({ record, isView, onCancel, getData }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();
	const { postSinhVienDangKyTruongModel, formSubmiting } = useModel('baohiemyte.dotdangky');

	const studentRegistration = record?.student;
	const declarationType = record?.declarationType ?? studentRegistration?.declarationType;
	// Form này không có chức năng sửa/bổ sung hồ sơ sau khi đã đăng ký, chỉ FormMien mới hỗ trợ
	const readOnly = !!isView || isRegisteredDeclarationType(declarationType);

	const personalInfo = usePersonalInfo(studentRegistration, isView);

	useEffect(() => {
		form.setFieldsValue({
			fullName: personalInfo.studentFullName,
			studentCode: personalInfo.studentCode,
			ngaySinh: parseDate(personalInfo.studentNgaySinh),
			cccd: personalInfo.studentCccd,
			nationality: personalInfo.isVN ? EBhytNationality.VIETNAM : EBhytNationality.FOREIGN,
			gioiTinh: personalInfo.studentGioiTinh,
			khoa: personalInfo.studentKhoa,
			nganh: personalInfo.studentNganh,
			phone: personalInfo.studentPhone,
			email: personalInfo.studentEmail,
			ssnNumber: studentRegistration?.ssnNumber,
			hanBHYTHienTai: parseDate(studentRegistration?.hanBHYTHienTai),
			diaChiThuongTru: studentRegistration?.diaChiThuongTru,
		});

		return () => resetFieldsForm(form);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [record?._id, personalInfo.recordSinhVien?._id]);

	const onFinish = async (values: any) => {
		if (readOnly || !record?.periodId) return;

		const payload: BaoHiemYTe.ISinhVienDangKyTruong = {
			periodStudentId: personalInfo.recordSinhVien?.ssoId,
			periodId: record.periodId,
			fullName: values.fullName,
			studentCode: values.studentCode,
			ngaySinh: values.ngaySinh ? dayjs(values.ngaySinh).toISOString() : undefined,
			cccd: values.cccd,
			nationality: personalInfo.isVN ? EBhytNationality.VIETNAM : EBhytNationality.FOREIGN,
			gioiTinh: values.gioiTinh,
			khoa: values.khoa,
			nganh: values.nganh,
			maKhoa: personalInfo.studentMaKhoa,
			maNganh: personalInfo.studentMaNganh,
			phone: values.phone,
			email: values.email,
			ssnNumber: values.ssnNumber,
			hanBHYTHienTai: values.hanBHYTHienTai ? dayjs(values.hanBHYTHienTai).toISOString() : undefined,
			diaChiThuongTru: values.diaChiThuongTru,
		};

		await postSinhVienDangKyTruongModel(payload, getData);
		onCancel();
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
						{t('baohiemyte.dangky.thongTinSinhVien')}
					</Divider>
				</Col>
				<PersonalInfoFields info={personalInfo} />

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
						{t('baohiemyte.dangky.thongTinBaoHiem')}
					</Divider>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='ssnNumber' label={t('baohiemyte.dangky.soBHXH')} rules={[...rules.required]}>
						<Input disabled={readOnly} placeholder={t('baohiemyte.dangky.placeholder.enterContent')} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='hanBHYTHienTai' label={t('baohiemyte.dangky.hanBHYTHienTai')}>
						<MyDatePicker
							disabled={readOnly}
							format='DD/MM/YYYY'
							placeholder={t('baohiemyte.dangky.placeholder.select')}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='diaChiThuongTru' label={t('baohiemyte.dangky.diaChiThuongTru')} rules={[...rules.required]}>
						<Input disabled={readOnly} placeholder={t('baohiemyte.dangky.placeholder.enterContent')} />
					</Form.Item>
				</Col>
			</Row>
			<div className='form-footer'>
				{!readOnly ? (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{t('baohiemyte.dangky.button.dangKy')}
					</Button>
				) : null}
				<Button htmlType='button' onClick={onCancel}>
					{t('global.button.huy')}
				</Button>
			</div>
		</Form>
	);
};

export default FormDangKyBHYT;
