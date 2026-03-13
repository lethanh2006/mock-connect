import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormQuyChe = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('quyche');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: QuyChe.IRecord) => {
		const fileDinhKem = await buildUpLoadFile(values, 'fileDinhKem');

		const payload: any = {
			...values,
			maModule: 'QLKH',
			fileDinhKem,
		};

		if (edit) {
			putModel(record?._id ?? '', payload, props.getData);
		} else postModel(payload, props.getData);
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'quy chế, quy định'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='ten' label='Tên quy chế, quy định' rules={[...rules.required, ...rules.text]}>
					<Input.TextArea autoFocus placeholder='Tên quy chế, quy định' />
				</Form.Item>
				<Form.Item name='moTa' label='Nội dung' rules={[...rules.required, ...rules.requiredHtml]}>
					<TinyEditor height={400} />
				</Form.Item>
				<Form.Item name='fileDinhKem' label='File đính kèm' rules={[...rules.fileRequired]}>
					<UploadFile maxCount={1} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormQuyChe;
