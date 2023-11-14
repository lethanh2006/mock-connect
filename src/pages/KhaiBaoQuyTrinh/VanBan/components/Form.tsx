import UploadFile from '@/components/Upload/UploadFile';
import { uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectTags from '@/pages/KhaiBaoQuyTrinh/Tag/Select';

const FormVanBan = () => {
	const { record, edit, postModel, putModel, setVisibleForm, loading } = useModel('quytrinh.vanban');
	const [form] = Form.useForm();
	const onFinish = async (val: any) => {
		try {
			const values = { ...val };
			if (val?.url?.fileList) {
				const urlFileDinhKem = await Promise.all(
					values?.url?.fileList?.map(async (file: any) => {
						const res = await uploadFile({
							file: file?.originFileObj,
							isPublic: '1',
						});
						return res?.data?.data?.url;
					}),
				);
				values.url = urlFileDinhKem?.[0];
			} else {
				values.url = val.url;
			}

			const payload = {
				...values,
			};
			if (edit) {
				putModel(record?._id, payload);
			} else {
				postModel(payload);
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({ ...record });
		}
	}, [edit, record]);
	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Spin spinning={loading}>
				<Form onFinish={onFinish} layout={'vertical'} form={form}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Form.Item label={'Tên văn bản'} name={'ten'} rules={[...rules.required, ...rules.length(200)]}>
								<Input placeholder={'Nhập tên văn bản'} autoFocus />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label={'Mã văn bản'} name={'ma'} rules={[...rules.required, ...rules.length(50)]}>
								<Input placeholder={'Nhập mã'} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label={'Nhãn'} name={'tags'} rules={[...rules.required]}>
								<SelectTags multiple dataState={'ten'} hasCreate />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label={'Tài liệu'}
								name={'url'}
								rules={[...rules.required, ...rules.fileRequired]}
								initialValue={renderFileListUrl(record?.url ?? '')}
							>
								<UploadFile maxCount={1} accept={'.docx, .pdf'} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button type={'primary'} htmlType={'submit'} style={{ marginRight: 8 }}>
										{edit ? 'Chỉnh sửa' : 'Thêm mới'}
									</Button>
									<Button
										onClick={() => {
											setVisibleForm(false);
										}}
									>
										Đóng
									</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Card>
	);
};
export default FormVanBan;
