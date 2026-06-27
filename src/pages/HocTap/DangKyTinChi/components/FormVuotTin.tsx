import { Button, Col, Descriptions, Divider, Form, InputNumber, Row, Typography } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';

const { Text } = Typography;

const FormVuotTin: React.FC = () => {
	const intl = useIntl();
	const { record: sinhVienRecord } = useModel('sinhvien.sinhvien');
	const { record: recHocKy } = useModel('daotao.hocky');
	const {
		soTinChiDangKy,
		setVisibleForm,
		edit,
		record,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		getSoTinChiDangKyModel,
	} = useModel('daotao.dkvuottinchi');
	const [form] = Form.useForm();

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
	};

	React.useEffect(() => {
		if (edit && record?._id) {
			form.setFieldsValue(record);
		} else if (!edit) {
			form.resetFields();
		}
		if (recHocKy?.ma) {
			getSoTinChiDangKyModel(recHocKy?.ma).then((res) => {
				form.setFieldsValue({
					soTinChiToiThieu: res?.soTinChiToiThieu,
					soTinChiToiDa: res?.soTinChiToiDa,
				});
			});
		}
	}, [recHocKy?.ma, record?._id, edit]);

	const onFinish = async (values: any) => {
		if (edit) {
			await putModel(record?._id as string, values, getData, true, true, undefined, `${record?._id}/cap-nhat`);
		} else {
			await postModel({ ...values, maHocKy: recHocKy?.ma }, getData);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish} initialValues={record}>
			<Descriptions column={2} layout='horizontal'>
				<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.descriptions.msv' })}>
					{sinhVienRecord?.ma}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.descriptions.hoten' })}>
					{sinhVienRecord?.ten || `${sinhVienRecord?.lastName || ''} ${sinhVienRecord?.firstName || ''}`}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.descriptions.hocky' })} span={2}>
					{recHocKy?.ten}
				</Descriptions.Item>
			</Descriptions>
			<Text type='secondary' italic style={{ display: 'block', marginBlock: 12 }}>
				{intl.formatMessage({ id: 'dangkytinchi.vuottin.form.note' })}
			</Text>
			<Row gutter={24}>
				<Col span={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.label.stctoithieuhientai' })}
						name='soTinChiToiThieu'
					>
						<InputNumber
							style={{ width: '100%' }}
							disabled
							formatter={(value) => `${value} ${intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}`}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.label.stctoidahientai' })}
						name='soTinChiToiDa'
					>
						<InputNumber
							style={{ width: '100%' }}
							disabled
							formatter={(value) => `${value} ${intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}`}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item
				label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.label.stctoidadangky' })}
				name='soTinChiToiDaDangKy'
				rules={[{ required: true }]}
			>
				<InputNumber
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.placeholder.sotinchi' })}
					min={soTinChiDangKy?.soTinChiToiThieu}
				/>
			</Form.Item>

			<Divider />

			<div className='form-footer'>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{intl.formatMessage({ id: 'dangkytinchi.vuottin.form.btn.luu' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: 'dangkytinchi.vuottin.form.btn.dong' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormVuotTin;
