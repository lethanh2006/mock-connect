import UploadFile from '@/components/Upload/UploadFile';
import { EDinhDangBaiThi, mapNameDinhDangBaiThi } from '@/services/KhaoThi/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Progress, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const mimeTypeMapping = {
	[EDinhDangBaiThi.HTML]: ['text/html'],
	[EDinhDangBaiThi.CSS]: ['text/css'],
	[EDinhDangBaiThi.TEXT_PLAIN]: ['text/plain'],
	[EDinhDangBaiThi.TEXT_CSV]: ['text/csv'],
	[EDinhDangBaiThi.JSON]: ['application/json'],
	[EDinhDangBaiThi.JS]: ['application/javascript', 'text/javascript'],
	[EDinhDangBaiThi.XML]: ['application/xml', 'text/xml'],
	[EDinhDangBaiThi.PDF]: ['application/pdf'],
	[EDinhDangBaiThi.ZIP]: ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip'], // ZIP
	[EDinhDangBaiThi.GZIP]: ['application/gzip', 'application/x-gzip'],
	[EDinhDangBaiThi.JPEG]: ['image/jpeg', 'image/pjpeg'],
	[EDinhDangBaiThi.PNG]: ['image/png'],
	[EDinhDangBaiThi.GIF]: ['image/gif'],
	[EDinhDangBaiThi.WEBP]: ['image/webp'],
	[EDinhDangBaiThi.AUDIO_MPEG]: ['audio/mpeg', 'audio/mp3'],
	[EDinhDangBaiThi.AUDIO_WAV]: ['audio/wav'],
	[EDinhDangBaiThi.VIDEO_MP4]: ['video/mp4'],
	[EDinhDangBaiThi.VIDEO_MPEG]: ['video/mpeg'],
	[EDinhDangBaiThi.OGG]: ['application/ogg', 'audio/ogg', 'video/ogg'],
	[EDinhDangBaiThi.FORM_DATA]: ['multipart/form-data'],
	[EDinhDangBaiThi.XLSX]: [
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-excel',
	],
	[EDinhDangBaiThi.DOCX]: [
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/msword',
	],
};

const FormBaiThiCuoiKy = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, visibleForm, setVisibleForm, nopBaiTapModel, uploadMultiPartModel, uploadProgress } =
		useModel('khaothi.sinhvienthi');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const isMimeTypeAllowed = (fileType: string, allowedTypes: string[]): boolean => {
		return allowedTypes.some((allowedType) => {
			const allowedMimeTypes = mimeTypeMapping[allowedType as EDinhDangBaiThi] || [allowedType]; // Lấy danh sách MIME type tương đương
			return allowedMimeTypes.includes(fileType);
		});
	};

	const onFinish = async (values: any) => {
		const fileList = values.urlBaiNop?.fileList || [];
		const allowedTypes = record?.dinhDangFileChoPhep || [];

		// Kiểm tra MIME type
		const invalidFiles = fileList?.filter((file: any) => {
			return !isMimeTypeAllowed(file.type, allowedTypes);
		});

		if (invalidFiles?.length > 0) {
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
			const urlBaiNop = await uploadMultiPartModel(
				fileList.map((file: any) => file.originFileObj),
				{
					maHocKy: record?.maHocKyHoc ?? '',
					maKyThi: record?.kyThiId ?? '',
					maHocPhan: record?.maHocPhan ?? '',
				},
			);

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
							<Progress
								percent={Math.round((uploadProgress?.success / uploadProgress?.totalPart) * 100)}
								status='active'
							/>
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
