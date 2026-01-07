import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiDeTaiCaNhan, EPhaseDeTaiKHCN, ETrangThaiXetDuyetDeCuong } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { primaryColor } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormNopHoSoSauThuyetMinh = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		formSubmiting,
		visibleForm,
		setLoading,
		loading,
		giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel,
	} = useModel('khoahoc.detaikhcn');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const rec = {
				...record?.dangKyKhcn,
				...record?.deCuongKhcn,
			};

			form.setFieldsValue(rec);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			if (!record) return;
			setLoading(true);
			const deCuongUrlChinhSua = await buildUpLoadFile(values, 'deCuongUrlChinhSua');
			const duToanUrl = await buildUpLoadFile(values, 'duToanUrl');
			const banGiaiTrinhUrl = await buildUpLoadFile(values, 'banGiaiTrinhUrl');
			const payload = {
				deCuongKhcn: {
					...record?.deCuongKhcn,
					...values,
					deCuongUrlChinhSua,
					banGiaiTrinhUrl,
					duToanUrl,
				},
			};

			giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel(record?._id, payload, 'de-cuong', props.getData)
				.then(() => form.resetFields())
				.catch((er) => {
					setLoading(false);
					console.log(er);
				});
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={'Nộp hồ sơ sau hội đồng thuyết minh'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.SAU_XET_DUYET_DE_CUONG &&
					record?.trangThaiSauXetDuyetDeCuong !== ETrangThaiXetDuyetDeCuong.CHUA_DUYET && (
						<div>
							<b>Ghi chú của phòng QLKH:</b>
							<span style={{ color: primaryColor }}> {record?.commentSauXetDuyetDeCuong}</span>
						</div>
					)}

				<Row gutter={[16, 0]}>
					<Col xs={24} sm={12}>
						<Form.Item
							rules={[...rules.fileRequired]}
							label='Thuyết minh đề tài NCKH (bản chỉnh sửa)'
							name='deCuongUrlChinhSua'
						>
							<UploadFile
								maxFileSize={10}
								maxCount={1}
								accept='.doc, .docx, .pdf'
								otherProps={{
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							rules={[...rules.fileRequired]}
							label='Bản giải trình nội dung chỉnh sửa và bổ sung thuyết minh'
							name='banGiaiTrinhUrl'
						>
							<UploadFile
								maxFileSize={10}
								maxCount={1}
								accept='.doc, .docx, .pdf, .xlsx'
								otherProps={{
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					{record?.dangKyKhcn?.loaiCaNhan === ELoaiDeTaiCaNhan.TAP_THE && (
						<Col xs={24} sm={12}>
							<Form.Item rules={[...rules.fileRequired]} label='Dự toán kinh phí' name='duToanUrl'>
								<UploadFile
									maxFileSize={10}
									maxCount={1}
									accept='.doc, .docx, .pdf, .xlsx'
									otherProps={{
										multiple: false,
										showUploadList: { showDownloadIcon: false },
									}}
								/>
							</Form.Item>
						</Col>
					)}
				</Row>

				<div className='form-footer'>
					<Button loading={loading || formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormNopHoSoSauThuyetMinh;
