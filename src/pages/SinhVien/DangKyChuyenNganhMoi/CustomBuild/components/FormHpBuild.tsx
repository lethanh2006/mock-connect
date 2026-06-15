import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { ETrangThaiKqht, trangThaiKqht } from '@/services/DaoTao/constant';
import rules from '@/utils/rules';
import { useIntl, useModel } from '@umijs/max';
import { Button, Col, Divider, Form, FormInstance, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import FormHPTuyenQuyet from './FormHPTuyenQuyet';
import FormHocPhanPhu from './FormHocPhanThayThe';
import FormItemHocPhanTable from './FormItemHocPhanTable';

const TRANG_THAI_KQHT_OPTIONS = Object.values(ETrangThaiKqht).map((v) => ({
	value: v,
	label: trangThaiKqht[v],
}));

const FormHpBuild = (props: {
	form?: FormInstance<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>;
	onCancel: () => void;
	initialValues?: PhieuDkCtdt.KhoiHocPhanDkCtdt;
	isView?: boolean;
	editIndex?: number;
}) => {
	const { form, onCancel, initialValues, isView = false, editIndex } = props;
	const intl = useIntl();
	const { danhSach } = useModel('hocphan.hocphan');
	const [formModal] = Form.useForm();
	const maHocPhanChinh = Form.useWatch(['hocPhanChinh', 'ma'], formModal);
	const hocPhanChinh = danhSach.find((item) => item.ma === maHocPhanChinh);

	useEffect(() => {
		if (initialValues) {
			formModal.setFieldsValue({
				hocPhanChinh: initialValues?.hocPhanChinh,
				soThuTuKy: initialValues?.soThuTuKy,
				hocPhanThayTheList: initialValues?.hocPhanThayTheList,
				dsHocPhanTienQuyet: initialValues?.dsHocPhanTienQuyet,
			});
		} else {
			formModal.resetFields();
		}
	}, [initialValues]);

	useEffect(() => {
		if (hocPhanChinh) {
			formModal.setFieldsValue({
				hocPhanChinh: {
					ma: hocPhanChinh?.ma,
					ten: hocPhanChinh?.ten,
					soTinChi: hocPhanChinh?.soTinChi,
					trangThaiKqht: hocPhanChinh?.trangThaiKqht,
				},
			});
		}
	}, [hocPhanChinh]);

	const onFinish = async (values: PhieuDkCtdt.KhoiHocPhanDkCtdt) => {
		if (!form) return;
		const khoiHpCtList = form.getFieldValue('khoiHpCtList') || [];

		if (editIndex !== undefined) {
			const updatedList = [...khoiHpCtList];
			updatedList[editIndex] = values;
			form.setFieldsValue({
				khoiHpCtList: updatedList,
			});
		} else {
			form.setFieldsValue({
				khoiHpCtList: [...khoiHpCtList, values],
			});
		}

		formModal.resetFields();
		onCancel();
	};

	return (
		<Form onFinish={onFinish} form={formModal} layout='vertical'>
			<Row gutter={[8, 0]}>
				{!isView && (
					<Col span={24} md={24}>
						<Form.Item
							name={['hocPhanChinh', 'ma']}
							label={intl.formatMessage({ id: 'minor.idm.form.mainCourse' })}
							rules={[...rules.required]}
						>
							<SelectHocPhan selectMa allowClear isMe />
						</Form.Item>
					</Col>
				)}
				<Col span={24} md={12}>
					<Form.Item name={['hocPhanChinh', 'ma']} label={intl.formatMessage({ id: 'minor.idm.form.courseCode' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Form.Item name={['hocPhanChinh', 'ten']} hidden />
				<Col span={24} md={12}>
					<Form.Item name={['hocPhanChinh', 'ten']} label={intl.formatMessage({ id: 'minor.idm.form.courseName' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name={['hocPhanChinh', 'soTinChi']} label={intl.formatMessage({ id: 'minor.idm.form.credits' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name={['hocPhanChinh', 'trangThaiKqht']}
						label={intl.formatMessage({ id: 'minor.idm.form.status' })}
					>
						<Select disabled options={TRANG_THAI_KQHT_OPTIONS} placeholder='--' optionFilterProp='label' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='soThuTuKy'
						label={intl.formatMessage({ id: 'minor.idm.form.expectedSemester' })}
						rules={isView ? [] : [...rules.number(10, 5, false), ...rules.required]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={5}
							max={20}
							disabled={isView}
							placeholder={intl.formatMessage({ id: 'minor.idm.form.expectedSemester' })}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={24}>
					<Divider orientation='left' className='divider-big-title' style={{ marginTop: 0 }} dashed>
						Học phần thay thế
					</Divider>
					<Form.Item name='hocPhanThayTheList'>
						<FormItemHocPhanTable
							form={formModal}
							FormComponent={FormHocPhanPhu}
							fieldName='hocPhanThayTheList'
							buttonText={intl.formatMessage({ id: 'minor.idm.button.addNew' })}
							modalTitle={intl.formatMessage({ id: 'minor.idm.button.addAlternate' })}
							spreadValue={false}
							disabled={isView}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Divider orientation='left' className='divider-big-title' style={{ marginTop: 0 }} dashed>
						Học phần tiên quyết
					</Divider>
					<Form.Item name='dsHocPhanTienQuyet' label={false}>
						<FormItemHocPhanTable
							form={formModal}
							FormComponent={FormHPTuyenQuyet}
							fieldName='dsHocPhanTienQuyet'
							buttonText={intl.formatMessage({ id: 'minor.idm.button.addNew' })}
							modalTitle={intl.formatMessage({ id: 'minor.idm.button.addNew' })}
							spreadValue={true}
							disabled={isView}
							isDisplayDiem
							formComponentProps={{ maHocPhanChinh: maHocPhanChinh }}
						/>
					</Form.Item>
				</Col>
			</Row>

			{!isView && (
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'minor.idm.button.confirm' })}
					</Button>
					<Button onClick={onCancel}>{intl.formatMessage({ id: 'minor.button.cancel' })}</Button>
				</div>
			)}
		</Form>
	);
};

export default FormHpBuild;
