import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCsvc } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Descriptions, Form, Input, Radio, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSinhVienDangKyBHYT = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();
	const {
		record: recDot,
		visibleForm,
		setVisibleForm,
		postSinhVienDangKyTruongModel,
		postSinhVienDangKyTuChonModel,
		setFormSubmiting,
		formSubmiting,
	} = useModel('baohienyte.dotdangky');
	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');
	const registrationType = Form.useWatch('registrationType', form);
	const quocTich = recordSinhVien?.quocTich;
	const laSinhVienQuocTe = quocTich === 'Quốc Tế';

	const passportImageFileId =
		(recordSinhVien as any)?.passportImageFileId ?? recDot?.myRegistration?.passportImageFileId;
	const visaImageFileId = (recordSinhVien as any)?.visaImageFileId ?? recDot?.myRegistration?.visaImageFileId;

	const renderHighlight = (value?: string | number | null) => (
		<span style={{ color: '#1f1f1f', fontWeight: 600 }}>{value || '--'}</span>
	);

	const studentDescriptionItems = [
		{
			key: 'fullName',
			label: 'Full Name',
			children: renderHighlight(recordSinhVien?.ten),
		},
		{
			key: 'studentId',
			label: 'Student ID',
			children: renderHighlight(recordSinhVien?.ma),
		},
		{
			key: 'dateOfBirth',
			label: 'Date of Birth',
			children: renderHighlight(
				recordSinhVien?.ngaySinh ? dayjs(recordSinhVien.ngaySinh).format('MMMM D, YYYY') : undefined,
			),
		},
		{
			key: 'nationalIdNumber',
			label: 'National ID Number',
			children: renderHighlight(recordSinhVien?.cccd),
		},
		{
			key: 'gender',
			label: 'Gender',
			children: renderHighlight(recordSinhVien?.gioiTinh),
		},
		{
			key: 'college',
			label: 'College',
			children: renderHighlight(recordSinhVien?.csdt?.ten ?? recordSinhVien?.khoaNganh?.ten ?? recordSinhVien?.maCSDT),
		},
		{
			key: 'phoneNumber',
			label: 'Phone Number',
			children: renderHighlight(recordSinhVien?.soDienThoai),
		},
		{
			key: 'emailAddress',
			label: 'Email Address',
			children: renderHighlight(recordSinhVien?.email),
		},
	];

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			return;
		} else {
			form.setFieldsValue({
				registrationType: 'school',
			});
		}
	}, [visibleForm]);

	const onFinish = async (values: BaoHiemYTe.ISinhVienDangKy) => {
		if (!recDot?.periodId) return;

		if (values.registrationType === 'school') {
			await postSinhVienDangKyTruongModel(recDot.periodId, getData);
		} else {
			setFormSubmiting(true);
			const passportImageFileId = await buildUpLoadFile(values, 'passportImageFileId', undefined, undefined, ipCsvc);
			const visaImageFileId = await buildUpLoadFile(values, 'visaImageFileId', undefined, undefined, ipCsvc);
			const proofFileId = await buildUpLoadFile(values, 'proofFileId', undefined, undefined, ipCsvc);

			values.passportImageFileId = passportImageFileId;
			values.visaImageFileId = visaImageFileId;
			values.proofFileId = proofFileId;
			setFormSubmiting(false);

			await postSinhVienDangKyTuChonModel(recDot?.periodId, values, getData);
		}
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Descriptions
						className='highlight'
						column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
						items={studentDescriptionItems}
						layout='vertical'
						colon={false}
					/>
				</Col>

				<Col span={24}>
					<Form.Item name='registrationType' label='Hình thức đăng ký' initialValue='school'>
						<Radio.Group>
							<Radio value='school'>Đăng ký theo trường</Radio>
							<Radio value='custom'>Đăng ký ngoài</Radio>
						</Radio.Group>
					</Form.Item>
				</Col>

				{registrationType === 'custom' ? (
					<>
						{laSinhVienQuocTe ? (
							<>
								<Col span={24} md={12}>
									<Form.Item name='insuranceProviderName' label='Đơn vị cấp bảo hiểm' rules={[...rules.required]}>
										<Input placeholder='Nhập đơn vị cấp bảo hiểm' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='insuranceCardNumber' label='Mã thẻ bảo hiểm' rules={[...rules.required]}>
										<Input placeholder='Nhập mã thẻ bảo hiểm' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='insuranceValidFrom' label='Bảo hiểm có hiệu lực từ' rules={[...rules.required]}>
										<MyDatePicker placeholder='Chọn ngày bắt đầu hiệu lực' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='insuranceValidTo' label='Bảo hiểm có hiệu lực đến' rules={[...rules.required]}>
										<MyDatePicker placeholder='Chọn ngày kết thúc hiệu lực' />
									</Form.Item>
								</Col>

								{!passportImageFileId ? (
									<Col span={24} md={12}>
										<Form.Item name='passportImageFileId' label='File hộ chiếu' rules={[...rules.required]}>
											<UploadFile />
										</Form.Item>
									</Col>
								) : null}

								{!visaImageFileId ? (
									<Col span={24} md={12}>
										<Form.Item name='visaImageFileId' label='File visa' rules={[...rules.required]}>
											<UploadFile />
										</Form.Item>
									</Col>
								) : null}
							</>
						) : (
							<>
								<Col span={24} md={12}>
									<Form.Item name='ssnNumber' label='Số CMND/CCCD' rules={[...rules.required]}>
										<Input placeholder='Nhập số CMND/CCCD' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='cardNumber' label='Số thẻ BHYT' rules={[...rules.required]}>
										<Input placeholder='Nhập số thẻ BHYT' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='cardExpiredAt' label='Ngày hết hạn thẻ' rules={[...rules.required]}>
										<MyDatePicker placeholder='Chọn ngày hết hạn thẻ' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='participantGroup' label='Nhóm đối tượng tham gia' rules={[...rules.required]}>
										<Input placeholder='Nhập nhóm đối tượng tham gia' />
									</Form.Item>
								</Col>

								<Col span={24} md={12}>
									<Form.Item name='initialClinicPlace' label='Nơi khám chữa bệnh ban đầu' rules={[...rules.required]}>
										<Input placeholder='Nhập nơi khám chữa bệnh ban đầu' />
									</Form.Item>
								</Col>
							</>
						)}

						<Col span={24} md={12}>
							<Form.Item name='proofFileId' label='File minh chứng' rules={[...rules.required]}>
								<UploadFile />
							</Form.Item>
						</Col>
					</>
				) : null}
			</Row>
			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					Đăng ký
				</Button>
				<Button htmlType='button' onClick={() => setVisibleForm(false)}>
					{t('global.button.huy')}
				</Button>
			</div>
		</Form>
	);
};

export default FormSinhVienDangKyBHYT;
