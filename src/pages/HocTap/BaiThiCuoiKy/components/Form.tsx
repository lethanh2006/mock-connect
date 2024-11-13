import UploadFile from '@/components/Upload/UploadFile';
import { mapNameDinhDangBaiThi } from '@/services/KhaoThi/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Progress, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBaiThiCuoiKy = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, visibleForm, setVisibleForm, nopBaiTapModel, uploadMultiPartModel, uploadProgress } =
		useModel('khaothi.sinhvienthi');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		const fileList = values.urlBaiNop?.fileList;
		const allowedTypes = record?.dinhDangFileChoPhep || [];

		// Kiểm tra loại file hợp lệ
		if (fileList?.some((file: any) => !allowedTypes.includes(file.type))) {
			const allowedFormats = allowedTypes.map((item) => mapNameDinhDangBaiThi[item]).join(', ');
			message.error(`File không đúng định dạng. Định dạng cho phép (${allowedFormats})`);
			return;
		}

		// Kiểm tra số lượng file
		if (fileList?.length !== record?.soFilePhaiNop) {
			message.error(`Số lượng file bắt buộc ${record?.soFilePhaiNop} file`);
			return;
		}

		try {
			// Gọi uploadMultiPartModel để tải nhiều file
			const urlBaiNop = await uploadMultiPartModel(fileList.map((file: any) => file.originFileObj));

			// Xử lý tiếp sau khi upload thành công
			await nopBaiTapModel(record?._id ?? '', { urlBaiNop }, getData);
			setVisibleForm(false);
		} catch (err) {
			console.error(err);
			message.error('Đã xảy ra lỗi khi nộp bài');
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
											Yêu cầu phải nộp {record?.soFilePhaiNop} file, dung lượng mỗi file không được quá{' '}
											{record?.dungLuongToiDa}
											MB
										</i>
									</small>
								}
							/>
						</Form.Item>
					</Col>

					{formSubmiting && uploadProgress?.totalPart ? (
						<Col span={24} style={{ textAlign: 'center' }}>
							<div> Đang upload file, vui lòng chờ đợi và không tắt form ...</div>
							<Progress percent={(uploadProgress?.success / uploadProgress?.totalPart) * 100} status='active' />
						</Col>
					) : null}
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
