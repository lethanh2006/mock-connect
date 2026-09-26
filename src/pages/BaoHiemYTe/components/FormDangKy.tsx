import MyDatePicker from '@/components/MyDatePicker';
import { isRegisteredDeclarationType } from '@/services/BaoHiemYTe/constant';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { getPhuongXa, getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { Col, Row } from '@/components/MyGrid';
import Input from '@/components/MyInput';
import VinSelect from '@/components/VinSelect';
import { Button } from '@/components/Icons';
import { Divider, Form } from 'antd';
import { useEffect, useState } from 'react';
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

/** Form đăng ký bảo hiểm y tế qua trường (sinh viên chưa có BHYT) */
const FormDangKyBHYT = ({ record, isView, onCancel, getData }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();
	const { postSinhVienDangKyTruongModel, formSubmiting } = useModel('baohiemyte.dotdangky');
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>();
	const [maTinhDiaChi, setMaTinhDiaChi] = useState<string>();

	const studentRegistration = record?.student;
	const declarationType = record?.declarationType ?? studentRegistration?.declarationType;
	// Form này không có chức năng sửa/bổ sung hồ sơ sau khi đã đăng ký, chỉ FormMien mới hỗ trợ
	const readOnly = !!isView || isRegisteredDeclarationType(declarationType);

	const personalInfo = usePersonalInfo(studentRegistration, isView, form);

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	useEffect(() => {
		if (!maTinhDiaChi) {
			setListXa(undefined);
			return;
		}
		getPhuongXa(maTinhDiaChi).then((data) => {
			setListXa(data.data.data);
		});
	}, [maTinhDiaChi]);

	const onChangeTinhDiaChi = (maTinh?: string) => {
		setMaTinhDiaChi(maTinh);
		form.setFieldsValue({ diaChiThuongTru: { maXaPhuong: undefined } });
	};

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
			maKhoa: personalInfo.studentMaKhoa,
			maNganh: personalInfo.studentMaNganh,
			phone: personalInfo.studentPhone,
			email: personalInfo.studentEmail,
			ssnNumber: studentRegistration?.ssnNumber,
			hanBHYTHienTai: parseDate(studentRegistration?.hanBHYTHienTai),
			diaChiThuongTru: studentRegistration?.diaChiThuongTru,
		});
		setMaTinhDiaChi(studentRegistration?.diaChiThuongTru?.maTinh);

		return () => resetFieldsForm(form);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [record?._id, personalInfo.recordSinhVien?._id]);

	const onFinish = async (values: any) => {
		if (readOnly || !record?.periodId) return;

		const payload: BaoHiemYTe.ISinhVienDangKyTruong = {
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
					<Form.Item name='ssnNumber' label={t('baohiemyte.dangky.soBHXH')} rules={[...rules.required, ...rules.text]}>
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
				<Col span={24} md={8}>
					<Form.Item name={['diaChiThuongTru', 'maTinh']} label={t('donvihanhchinh.tp')} rules={[...rules.required]}>
						<VinSelect
							disabled={readOnly}
							placeholder={t('donvihanhchinh.tp.place')}
							allowClear
							showSearch
							optionFilterProp='label'
							options={listTinh?.map((item) => ({ value: item.ma, label: item.tenDonVi }))}
							onChange={onChangeTinhDiaChi}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item
						name={['diaChiThuongTru', 'maXaPhuong']}
						label={t('donvihanhchinh.xa')}
						rules={[...rules.required]}
					>
						<VinSelect
							disabled={readOnly}
							placeholder={t('donvihanhchinh.xa.place')}
							allowClear
							showSearch
							optionFilterProp='label'
							notFoundContent={!maTinhDiaChi ? 'Chọn tỉnh/thành phố trước' : undefined}
							options={listXa?.map((item) => ({ value: item.ma, label: item.tenDonVi }))}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item
						name={['diaChiThuongTru', 'soNhaTenDuong']}
						label={t('donvihanhchinh.sonha')}
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input disabled={readOnly} placeholder={t('donvihanhchinh.sonha.place')} />
					</Form.Item>
				</Col>
			</Row>
			<div className='form-footer'>
				{!readOnly ? (
					<Button loading={formSubmiting} type='submit' variant='default'>
						{t('baohiemyte.dangky.button.dangKy')}
					</Button>
				) : null}
				<Button variant='outline' onClick={onCancel}>
					{t('global.button.huy')}
				</Button>
			</div>
		</Form>
	);
};

export default FormDangKyBHYT;
