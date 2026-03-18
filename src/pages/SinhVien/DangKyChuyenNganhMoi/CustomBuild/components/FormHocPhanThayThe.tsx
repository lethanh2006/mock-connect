import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { ETrangThaiKqht, trangThaiKqht } from '@/services/DaoTao/constant';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';

const TRANG_THAI_KQHT_OPTIONS = Object.values(ETrangThaiKqht).map((v) => ({
	value: v,
	label: trangThaiKqht[v],
}));

const FormHocPhanThayThe = (props: { onOk: (val: PhieuDkCtdt.HocPhanDkCtdt[]) => void; onCancel?: () => void }) => {
	const [form] = Form.useForm();
	const { onOk, onCancel } = props;
	const intl = useIntl();
	const { danhSach: danhSachHocPhan } = useModel('hocphan.hocphan');

	const maHocPhanThayThe = Form.useWatch('ma', form);
	const hocPhanThayThe: any = danhSachHocPhan.find((i) => i.ma === maHocPhanThayThe);

	useEffect(() => {
		if (hocPhanThayThe) {
			form.setFieldsValue({
				ma: maHocPhanThayThe,
				ten: hocPhanThayThe?.ten,
				soTinChi: hocPhanThayThe?.soTinChi,
				trangThaiKqht: hocPhanThayThe?.trangThaiKqht,
			});
		}
	}, [hocPhanThayThe]);
	const onFinish = async (values: PhieuDkCtdt.HocPhanDkCtdt) => {
		form.resetFields();
		onOk([values]);
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item
						name='ma'
						label={intl.formatMessage({ id: 'minor.idm.form.alternateCourse' })}
						rules={[...rules.required]}
					>
						<SelectHocPhan selectMa allowClear isMe />
					</Form.Item>
					<Form.Item name='ten' label={intl.formatMessage({ id: 'minor.idm.form.courseName' })} hidden />
				</Col>
				<Col span={24}>
					<Form.Item name='ma' label={intl.formatMessage({ id: 'minor.idm.form.courseCode' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='soTinChi' label={intl.formatMessage({ id: 'minor.idm.form.creditsCount' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='trangThaiKqht' label={intl.formatMessage({ id: 'minor.idm.form.status' })}>
						<Select disabled options={TRANG_THAI_KQHT_OPTIONS} optionFilterProp='label' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'minor.idm.button.addAlternate' })}
				</Button>
				<Button
					onClick={() => {
						form.resetFields();
						onCancel?.();
					}}
				>
					{intl.formatMessage({ id: 'minor.button.cancel' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormHocPhanThayThe;
