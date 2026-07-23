import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { EGiayToCanNopType } from '@/services/DaoTao/DotNhapHoc/constant';
import rules from '@/utils/rules';
import { CheckCircleFilled } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select, Table, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Fragment, useEffect } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
import SectionHeader from './SectionHeader';
import type { DotNhapHoc } from '@/services/DaoTao/DotNhapHoc/typings';

const isForeignNationalityText = (nationality?: string) => {
	if (!nationality) return false;
	const normalized = nationality
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
	return !normalized.includes('viet nam');
};

const BANK_OPTIONS = [
	'Vietcombank',
	'BIDV',
	'Agribank',
	'VietinBank',
	'Techcombank',
	'MB Bank',
	'ACB',
	'VPBank',
	'Sacombank',
	'TPBank',
].map((name) => ({ value: name, label: name }));

const PHONE_COUNTRY_OPTIONS = [
	{ value: '+84', label: 'VietNam (+84)' },
	{ value: '+1', label: 'USA (+1)' },
	{ value: '+82', label: 'Korea (+82)' },
	{ value: '+86', label: 'China (+86)' },
];

/** Placeholder — no such catalog exists in this codebase yet. */
const VISA_TYPE_OPTIONS = [
	{ value: 'Student Visa (DH)', label: 'Student Visa (DH)' },
	{ value: 'Tourist Visa (DL)', label: 'Tourist Visa (DL)' },
	{ value: 'Business Visa (DN)', label: 'Business Visa (DN)' },
	{ value: 'Other', label: 'Other' },
];

/** Placeholder — no such catalog exists in this codebase yet. */
const VISA_ISSUING_AUTHORITY_OPTIONS = [
	{ value: 'Vietnam Immigration Department', label: 'Vietnam Immigration Department' },
	{ value: 'Embassy/Consulate of Vietnam', label: 'Embassy/Consulate of Vietnam' },
	{ value: 'Other', label: 'Other' },
];

const GIAY_TO_TYPE_LABELS: Record<EGiayToCanNopType, string> = {
	[EGiayToCanNopType.BAN_MEM]: 'Soft Copy',
	[EGiayToCanNopType.BAN_CUNG]: 'Hard Copy',
};

const documentColumns: ColumnsType<DotNhapHoc.IGiayToCanNopNhapHoc> = [
	{ title: 'No.', width: 56, render: (_, __, index) => index + 1 },
	{ title: 'Document Name', dataIndex: 'ten' },
	{ title: 'Quantity', dataIndex: 'soLuong', width: 90, align: 'center' },
	{
		title: 'Required',
		dataIndex: 'required',
		width: 90,
		align: 'center',
		render: (required?: boolean) => (required ? <CheckCircleFilled style={{ color: '#57a443' }} /> : null),
	},
	{
		title: 'Type',
		dataIndex: 'type',
		width: 120,
		render: (type?: EGiayToCanNopType[]) => type?.map((item) => <div key={item}>{GIAY_TO_TYPE_LABELS[item] ?? item}</div>),
	},
	{
		title: 'Notes',
		dataIndex: 'huongDan',
		render: (huongDan: string | undefined, row) => (
			<Fragment>
				{huongDan}
				{row.urlFileHuongDan && (
					<div>
						<a href={row.urlFileHuongDan} target='_blank' rel='noreferrer'>
							View sample
						</a>
					</div>
				)}
			</Fragment>
		),
	},
	{
		title: 'Attachment',
		key: 'attachment',
		width: 160,
		render: (_, row) => (
			<Form.Item name={`document_${row.id}`} noStyle>
				<UploadFile buttonSize='small' buttonDescription='Upload File' maxCount={1} />
			</Form.Item>
		),
	},
];

const PersonalInformationStep = ({
	form,
	listTinh,
	listLoaiKhuyetTat,
}: {
	form: FormInstance<any>;
	listTinh?: DonViHanhChinh.IRecord[];
	listLoaiKhuyetTat?: LoaiKhuyetTat.IRecord[];
}) => {
	const adjustmentNeeds: string[] = Form.useWatch('adjustmentNeeds', form) ?? [];
	const nationality: string | undefined = Form.useWatch('nationality', form);
	const maQuocTich: string | undefined = Form.useWatch('maQuocTich', form);
	const hasHealthProblem: boolean | undefined = Form.useWatch('hasHealthProblem', form);
	const isForeignNational = isForeignNationalityText(nationality);
	const { danhSach: quocTichList } = useModel('core.quoctich');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const documentRows = recSinhVien?.dotNhapHoc?.danhSachGiayToNhapHoc ?? [];

	useEffect(() => {
		const found = quocTichList?.find((item) => item.tenQuocTich === nationality);
		form.setFieldsValue({ maQuocTich: found?.ma });
	}, [nationality, quocTichList]);

	const handleSameAsResidence = (checked: boolean) => {
		if (!checked) return;
		form.setFieldsValue({
			tinhTpThuongTru: form.getFieldValue('tinhTpKhaiBao'),
			maTinhTpThuongTru: form.getFieldValue('maTinhTpKhaiBao'),
			xaPhuongThuongTru: form.getFieldValue('xaPhuongKhaiBao'),
			maXaPhuongThuongTru: form.getFieldValue('maXaPhuongKhaiBao'),
		});
	};

	return (
		<Fragment>
			<SectionHeader>Personal Information</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='firstName' label='First Name' rules={[...rules.required, ...rules.ten]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='middleName' label='Middle Name' rules={[...rules.required, ...rules.ten]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='lastName' label='Last Name' rules={[...rules.required, ...rules.ten]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>

				<Col span={12} md={8}>
					<Form.Item name='dob' label='Date of birth' rules={[...rules.required, ...rules.ngaySinh]}>
						<MyDatePicker placeholder='Select' style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='gender' label='Gender' rules={[...rules.required]}>
						<Select
							placeholder='Enter content'
							options={[
								{ value: 'Nam', label: 'Male' },
								{ value: 'Nữ', label: 'Female' },
								{ value: 'Khác', label: 'Other' },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item label='Phone Number' required>
						<Input.Group compact style={{ display: 'flex' }}>
							<Form.Item name='phoneCountryCode' noStyle initialValue='+84'>
								<Select style={{ width: 150 }} options={PHONE_COUNTRY_OPTIONS} />
							</Form.Item>
							<Form.Item name='phoneNumber' noStyle rules={[...rules.required]}>
								<Input style={{ flex: 1 }} placeholder='Enter content' />
							</Form.Item>
						</Input.Group>
					</Form.Item>
				</Col>

				<Col span={12} md={8}>
					<Form.Item name='nationalIdNumber' label='National ID Number' rules={[...rules.CMND]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='issueDate' label='Issue Date' rules={[...rules.truocHomNay]}>
						<MyDatePicker placeholder='Select' style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='placeOfIssue' label='Place of Issue' rules={[...rules.text, ...rules.length(250)]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>

				<Col span={12} md={8}>
					<Form.Item name='vinuniAccount' label='VinUni Account' rules={[...rules.required, ...rules.email]}>
						<Input disabled={!!recSinhVien?.email} placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='postalCode' label='Postal Code' rules={[...rules.text, ...rules.length(20)]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
			</Row>

			<SectionHeader>Additional Information</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='nationality' label='Nationality' rules={[...rules.required]}>
						<SelectQuocTich allowClear selectTen />
					</Form.Item>
					<Form.Item name='maQuocTich' noStyle>
						<Input type='hidden' />
					</Form.Item>
				</Col>

				{isForeignNational ? (
					<Col span={24} md={8}>
						<Form.Item label='Country Code' required>
							<Input disabled value={maQuocTich} placeholder='Enter content' />
						</Form.Item>
					</Col>
				) : (
					<Fragment>
						<Col span={24} md={8}>
							<Form.Item name='ethnicity' label='Ethnicity' rules={[...rules.required]}>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='religion' label='Religion' rules={[...rules.required]}>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
					</Fragment>
				)}

				{!isForeignNational && (
					<Fragment>
						<Col span={24} md={12}>
							<Form.Item name='frontIdCard' label='Front of National ID Card' rules={[...rules.fileRequired]}>
								<UploadFile buttonDescription='Select File' maxCount={1} otherProps={{ className: styles.uploadButton }} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='backIdCard' label='Back of National ID Card' rules={[...rules.fileRequired]}>
								<UploadFile buttonDescription='Select File' maxCount={1} otherProps={{ className: styles.uploadButton }} />
							</Form.Item>
						</Col>
					</Fragment>
				)}
			</Row>

			{isForeignNational && (
				<Fragment>
					<div className={styles.subLabel}>Visa Information</div>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='passportNumber' label='Passport number' rules={[...rules.required, ...rules.text]}>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaType' label='Visa Type' rules={[...rules.required]}>
								<Select placeholder='Enter content' allowClear options={VISA_TYPE_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaIssueDate' label='Issue Date' rules={[...rules.required]}>
								<MyDatePicker placeholder='Select' style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaExpiryDate' label='Expiration Date' rules={[...rules.required]}>
								<MyDatePicker placeholder='Select' style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaIssuingAuthority' label='Issuing Authority' rules={[...rules.required]}>
								<Select placeholder='Enter content' allowClear options={VISA_ISSUING_AUTHORITY_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaPlaceOfIssue' label='Place of Issue' rules={[...rules.required, ...rules.text]}>
								<Input placeholder='Enter content' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='passportAttachment' label='Passport Attachment' rules={[...rules.fileRequired]}>
								<UploadFile buttonDescription='Select File' maxCount={1} otherProps={{ className: styles.uploadButton }} />
							</Form.Item>
							<div className={styles.uploadHelperText}>Photo/Scan</div>
						</Col>
					</Row>
				</Fragment>
			)}

			<div className={styles.subLabel}>Place of Birth</div>
			<SelectDonViHanhChinh
				form={form}
				listTinh={listTinh}
				suffix='NoiSinh'
				hideXaPhuong
				hasLabel
				labelTinh='Province/City'
				placeholderTinh='Enter content'
			/>

			<div className={styles.subLabel}>Place of Residence</div>
			<SelectDonViHanhChinh
				form={form}
				listTinh={listTinh}
				suffix='KhaiBao'
				hasLabel
				labelTinh='Province/City'
				placeholderTinh='Enter content'
				labelXaPhuong='Commune/Ward/Special zone'
				placeholderXaPhuong='Enter content'
			/>

			<div className={styles.subLabel}>Permanent Residence</div>
			<Form.Item name='sameAsResidence' valuePropName='checked' style={{ marginBottom: 8 }}>
				<Checkbox onChange={(e) => handleSameAsResidence(e.target.checked)}>
					The information is the same as the &quot;Place of Residence&quot; field
				</Checkbox>
			</Form.Item>
			<SelectDonViHanhChinh
				form={form}
				listTinh={listTinh}
				suffix='ThuongTru'
				hasSoNha
				hasLabel
				labelTinh='Province/City'
				placeholderTinh='Enter content'
				labelXaPhuong='Commune/Ward/Special zone'
				placeholderXaPhuong='Enter content'
				labelSoNha='House Number/ Street Name'
				placeholderSoNha='Enter content'
			/>

			<SectionHeader>Bank Account Information</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='bank' label='Bank'>
						<Select placeholder='Enter content' allowClear showSearch options={BANK_OPTIONS} optionFilterProp='label' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='bankAccountNumber' label='Bank Account Number' rules={[...rules.sotaikhoan]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='accountHolderName' label='Account Holder Name' rules={[...rules.ten]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='bankBranch' label='Bank Branch' rules={[...rules.text, ...rules.length(250)]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
			</Row>

			<SectionHeader>Health Information</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={12} md={6}>
					<Form.Item name='height' label='Height (cm)' rules={[...rules.required, ...rules.number(300, 0)]}>
						<InputNumber style={{ width: '100%' }} placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='weight' label='Weight (kg)' rules={[...rules.required, ...rules.number(300, 0)]}>
						<InputNumber style={{ width: '100%' }} placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='disabilityType' label='Disability Type'>
						<Select
							placeholder='Enter content'
							allowClear
							showSearch
							optionFilterProp='label'
							options={listLoaiKhuyetTat?.map((item) => ({ value: item.ma, label: item.ten }))}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='bloodType' label='Blood Type' rules={[...rules.length(10)]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='medicalNotes' label='Medical Notes' rules={[...rules.length(1000)]}>
						<Input.TextArea rows={3} placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='hasHealthProblem'
						label='Do you have health problem?'
						rules={[...rules.required]}
					>
						<Radio.Group
							options={[
								{ value: false, label: 'No' },
								{ value: true, label: 'Yes' },
							]}
						/>
					</Form.Item>
				</Col>
				{hasHealthProblem === true && (
					<Col span={24} md={12}>
						<Form.Item
							name='healthProblemAttachment'
							label='Health Problem Attachment'
							rules={[...rules.fileRequired]}
						>
							<UploadFile buttonDescription='Select File' maxCount={1} otherProps={{ className: styles.uploadButton }} />
						</Form.Item>
					</Col>
				)}
			</Row>

			<SectionHeader>Document Upload</SectionHeader>
			<Table
				className={styles.docTable}
				rowKey={(row, index) => row.id ?? index ?? 0}
				dataSource={documentRows}
				columns={documentColumns}
				pagination={false}
				size='small'
			/>

			<SectionHeader>Survey</SectionHeader>
			<Form.Item
				name='firstGenStudent'
				label='1. Are you the first person in your family to attend university?'
				rules={[...rules.required]}
			>
				<Radio.Group
					options={[
						{ value: true, label: 'Yes' },
						{ value: false, label: 'No' },
					]}
				/>
			</Form.Item>

			<Form.Item
				name='adjustmentNeeds'
				label='2. If you would like tailored adjustments to support your learning environment, please indicate below'
				rules={[...rules.required]}
			>
				<Checkbox.Group
					options={[
						{ value: 'sensory', label: 'Sensory (hearing, vision, speech)' },
						{ value: 'physical', label: 'Physical (mobility, short stature)' },
						{ value: 'mental', label: 'Mental health (depression, anxiety, bipolar disorder, OCD)' },
						{
							value: 'medical',
							label:
								"Medical (diabetes, epilepsy, Crohn's disease, cancer, irritable bowel syndrome (IBS), hypertension, stroke)",
						},
						{ value: 'others', label: 'Others (please specify)' },
					]}
					style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
				/>
			</Form.Item>

			{adjustmentNeeds?.includes('others') && (
				<Form.Item name='adjustmentOthersText' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder='Enter content' />
				</Form.Item>
			)}
		</Fragment>
	);
};

export default PersonalInformationStep;
