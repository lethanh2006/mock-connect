import UploadFile from '@/components/Upload/UploadFile';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, message, Modal, Row, Statistic } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { Countdown } = Statistic;

const ModalNopTaiLieu = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const [form] = Form.useForm();
	const { visible, setVisible, getData } = props;
	const { record, formSubmiting, nopTaiLieuModel, setFormSubmiting } = useModel('thuvien.danhsachdot');
	const commit: boolean = Form.useWatch('commit', form);

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visible]);

	const onFinish = async (values: any) => {
		const filesToUpload: { field: any; idField: any }[] = [
			{ field: 'urlTaiLieu', idField: 'idTaiLieu' },
			{ field: 'urlTomTat', idField: 'idTomTat' },
			{ field: 'urlTaiLieuMinhChung', idField: 'idTaiLieuMinhChung' },
		];

		setFormSubmiting(true);

		// Tạo danh sách các promise tải file
		const uploadPromises = filesToUpload.map(async ({ field, idField }) => {
			const fileData = values[field]?.fileList?.[0];
			if (fileData?.originFileObj) {
				const res = await uploadFile({
					file: fileData.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				values[field] = res?.data?.data?.url;
				values[idField] = res?.data?.data?.file?._id;
			} else {
				values[field] = fileData?.url;
			}
		});

		await Promise.allSettled(uploadPromises);
		setFormSubmiting(false);

		if (values?.commit) {
			nopTaiLieuModel(record?._id ?? '', values, getData)
				.then(() => setVisible(false))
				.catch((err) => console.log(err));
		} else {
			message.warn('Vui lòng xác nhận quy định');
		}
	};

	return (
		<Modal
			title='Nộp tài liệu'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			destroyOnClose
			width={800}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<div style={{ textAlign: 'center', marginBottom: '8px' }}>
							<h1 style={{ color: '#CC0D00' }}>Tên đợt: {record?.dot?.tenDot}</h1>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<span>Thời gian : {moment(record?.dot?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</span> -{' '}
								<span>{moment(record?.dot?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</span>
								<span>
									{moment(record?.dot?.thoiGianKetThuc).isAfter(moment()) &&
										moment(record?.dot?.thoiGianBatDau).isBefore(moment()) && (
											<div
												style={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													marginLeft: 8,
												}}
											>
												<span>(</span>
												<p
													style={{
														color: '#CC0D00',
														marginBottom: 0,
														marginRight: 8,
														fontSize: '16px',
													}}
												>
													Còn lại:
												</p>
												<Countdown
													valueStyle={{ fontSize: 16 }}
													value={moment(record?.dot?.thoiGianKetThuc).unix() * 1000}
													// onFinish={() => setUpdateTrangThai('finish')}
													format='D Ngày H Giờ m Phút s giây )'
												/>
											</div>
										)}
								</span>
							</div>
							{record?.dot?.ghiChu && record?.dot?.ghiChu !== '' && <div>Ghi chú: {record?.dot?.ghiChu}</div>}
						</div>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTaiLieu'
							label={'Tài liệu toàn bộ đề tài (docx)'}
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx, .pdf',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
								maxFileSize={15}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTomTat'
							label={'Tài liệu tóm tắt đề tài (docx)'}
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx, .pdf',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
								maxFileSize={15}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTaiLieuMinhChung'
							label={'Tài liệu minh chứng đề tài (pdf)'}
						>
							<UploadFile
								otherProps={{
									maxCount: 2,
									accept: '.pdf',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
								maxFileSize={15}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='commit' valuePropName='checked' initialValue={false}>
							<Checkbox>
								Tôi xin cam kết thông tin mà tôi đã khai là đúng sự thật nếu sai tôi xin chịu hoàn toàn trách nhiệm
								trước nhà trường.
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary' disabled={!commit}>
						Hoàn tất
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalNopTaiLieu;
