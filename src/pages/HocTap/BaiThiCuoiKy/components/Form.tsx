import UploadFile from '@/components/Upload/UploadFile';
import { mapNameDinhDangBaiThi } from '@/services/KhaoThi/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBaiThiCuoiKy = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, setFormSubmiting, formSubmiting, visibleForm, setVisibleForm, nopBaiTapModel } =
		useModel('khaothi.sinhvienthi');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		const fileList = values.urlBaiNop?.fileList;
		const allowedTypes = record?.dinhDangFileChoPhep || [];

		if (fileList?.some((file: any) => !allowedTypes.includes(file.type))) {
			const allowedFormats = allowedTypes.map((item) => mapNameDinhDangBaiThi[item]).join(', ');
			message.error(`File không đúng định dạng. Định dạng cho phép (${allowedFormats})`);
			return;
		}

		if (fileList?.length !== record?.soFilePhaiNop) {
			message.error(`Số lượng file bắt buộc ${record?.soFilePhaiNop} file`);
			return;
		}
		setFormSubmiting(true);

		try {
			const urlBaiNop = await buildUpLoadMultiFile(values, 'urlBaiNop');
			await nopBaiTapModel(record?._id ?? '', { urlBaiNop: urlBaiNop }, getData);
			setVisibleForm(false);
		} catch (err) {
			console.error(err);
			message.error('Đã xảy ra lỗi khi nộp bài.');
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Card title='Nộp bài tập'>
			<Form scrollToFirstError onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Form.Item rules={[...rules.required]} name='urlBaiNop' label='File bài tập'>
							<UploadFile
								maxCount={record?.soFilePhaiNop}
								maxFileSize={record?.dungLuongToiDa}
								extra={
									<small style={{ color: '#999' }}>
										<i>
											Số lượng file {record?.soFilePhaiNop}, dung lượng mỗi file không được quá {record?.dungLuongToiDa}
											MB
										</i>
									</small>
								}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Nộp bài
					</Button>

					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormBaiThiCuoiKy;
