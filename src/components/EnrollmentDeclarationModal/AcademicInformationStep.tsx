import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTruongThpt from '@/pages/Core/TruongThpt/SelectTruongThpt';
import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Radio, Row, Select, Table, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Fragment } from 'react';
import { ENGLISH_CERTIFICATE_TYPE_OPTIONS, PRIORITY_AREA_OPTIONS, PRIORITY_CATEGORY_OPTIONS } from './academicConstants';
import { TRAINING_LEVEL_OPTIONS } from './guardianConstants';
import styles from './index.less';
import SectionHeader from './SectionHeader';

const YES_NO_OPTIONS = [
	{ value: true, label: 'Yes' },
	{ value: false, label: 'No' },
];

type TGradeRow = {
	key: 'diemToan' | 'diemVan' | 'diemTiengAnh' | 'diemLy' | 'diemHoa' | 'diemSinh' | 'diemTrungBinhNam';
	label: string;
};

const GRADE_ROWS: TGradeRow[] = [
	{ key: 'diemToan', label: 'Mathematics' },
	{ key: 'diemVan', label: 'Literature' },
	{ key: 'diemTiengAnh', label: 'English' },
	{ key: 'diemLy', label: 'Physics' },
	{ key: 'diemHoa', label: 'Chemistry' },
	{ key: 'diemSinh', label: 'Biology' },
	{ key: 'diemTrungBinhNam', label: 'Year Average' },
];

const gradeColumns: ColumnsType<TGradeRow> = [
	{ title: 'Subjects', dataIndex: 'label', width: 200 },
	...(['10', '11', '12'] as const).map((grade) => ({
		title: `Grade ${grade}`,
		key: `grade${grade}`,
		render: (_: unknown, row: TGradeRow) => (
			<Form.Item name={`${row.key}_${grade}`} noStyle>
				<InputNumber style={{ width: '100%' }} placeholder='Enter content' />
			</Form.Item>
		),
	})),
];

/** One high-school identity block — reused for the single (not-transferred) case and per grade-year when the student transferred schools */
const HighSchoolBlock = ({
	form,
	listTinhTruongThpt,
	suffix,
	isDomestic,
}: {
	form: FormInstance<any>;
	listTinhTruongThpt?: TruongThpt.ITinhTP[];
	suffix: string;
	isDomestic: boolean;
}) => {
	if (isDomestic) {
		return <SelectTruongThpt form={form} suffix={suffix} listTinh={listTinhTruongThpt} />;
	}

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item name={`hsCountry${suffix}`} label='Country' rules={[...rules.required, ...rules.text]}>
					<SelectQuocTich placeholder='Country' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name={`hsCity${suffix}`} label='Province/City' rules={[...rules.required, ...rules.text]}>
					<Input placeholder='Enter content' />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item name={`hsName${suffix}`} label='High School Name' rules={[...rules.required, ...rules.text]}>
					<Input placeholder='Enter content' />
				</Form.Item>
			</Col>
		</Row>
	);
};

const AcademicInformationStep = ({
	form,
	listTinhTruongThpt,
}: {
	form: FormInstance<any>;
	listTinhTruongThpt?: TruongThpt.ITinhTP[];
}) => {
	const pursuingDegree: boolean | undefined = Form.useWatch('pursuingDegree', form);
	const attendedHighSchoolInVietnam: boolean | undefined = Form.useWatch('attendedHighSchoolInVietnam', form);
	const transferredHighSchool: boolean | undefined = Form.useWatch('transferredHighSchool', form);
	const isDomestic = attendedHighSchoolInVietnam === true;
	const isTransferred = transferredHighSchool === true;

	return (
		<Fragment>
			<SectionHeader>Academic Information</SectionHeader>

			<Form.Item
				name='pursuingDegree'
				label='Are you currently pursuing a degree or academic program at another university, college, or higher education institution?'
				rules={[...rules.required]}
			>
				<Radio.Group options={YES_NO_OPTIONS} />
			</Form.Item>

			{pursuingDegree === true && (
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='universityName' label='College or University Name' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Enter content' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='universityMajor' label='Program name' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Enter content' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='universityDegreeLevel' label='Program level' rules={[...rules.required]}>
							<Select placeholder='Enter content' allowClear options={TRAINING_LEVEL_OPTIONS} />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name='universityFromDate' label='From' rules={[...rules.required]}>
							<MyDatePicker pickerStyle='month' format='MM/YYYY' placeholder='mm/yyyy' style={{ width: '100%' }} allowClear />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name='universityToDate' label='To' rules={[...rules.required]}>
							<MyDatePicker pickerStyle='month' format='MM/YYYY' placeholder='mm/yyyy' style={{ width: '100%' }} allowClear />
						</Form.Item>
					</Col>
				</Row>
			)}

			<div className={styles.subLabel}>High School Information</div>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item name='attendedHighSchoolInVietnam' label='Did you attend high school in Vietnam?' rules={[...rules.required]}>
						<Radio.Group options={YES_NO_OPTIONS} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='transferredHighSchool'
						label='Did you transfer to another high school during your high school studies?'
						rules={[...rules.required]}
					>
						<Radio.Group options={YES_NO_OPTIONS} />
					</Form.Item>
				</Col>
			</Row>

			{attendedHighSchoolInVietnam !== undefined &&
				(isTransferred ? (
					(['10', '11', '12'] as const).map((grade) => (
						<Fragment key={grade}>
							<div className={styles.subLabel}>Grade {grade} High School</div>
							<HighSchoolBlock form={form} listTinhTruongThpt={listTinhTruongThpt} suffix={grade} isDomestic={isDomestic} />
						</Fragment>
					))
				) : (
					<HighSchoolBlock form={form} listTinhTruongThpt={listTinhTruongThpt} suffix='' isDomestic={isDomestic} />
				))}

			<Row gutter={[12, 0]}>
				{isDomestic && (
					<Fragment>
						<Col span={24} md={8}>
							<Form.Item name='priorityCategory' label='Priority Category'>
								<Select placeholder='Enter content' allowClear options={PRIORITY_CATEGORY_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='priorityArea' label='Priority Area'>
								<Select placeholder='Enter content' allowClear options={PRIORITY_AREA_OPTIONS} />
							</Form.Item>
						</Col>
					</Fragment>
				)}
				<Col span={24} md={isDomestic ? 8 : 24}>
					<Form.Item name='graduationYear' label='Graduation Year' rules={[...rules.required, ...rules.number(2100, 1900, false)]}>
						<InputNumber style={{ width: '100%' }} placeholder='Enter content' />
					</Form.Item>
				</Col>
				{/* <Col span={24} md={8}>
					<Form.Item name='academicRanking' label='High School Academic Ranking'>
						<Select
							placeholder='Enter content'
							allowClear
							options={Object.values(ELoaiHocLuc).map((item) => ({ value: item, label: item }))}
						/>
					</Form.Item>
				</Col> */}
			</Row>

			<div className={styles.subLabel}>High School Grade</div>
			<Table
				className={styles.docTable}
				rowKey='key'
				dataSource={GRADE_ROWS}
				columns={gradeColumns}
				pagination={false}
				size='small'
			/>

			<SectionHeader>Most recent English proficiency certificate</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='certificateType' label='Certificate Type' rules={[...rules.required]}>
						<Select placeholder='Enter content' allowClear options={ENGLISH_CERTIFICATE_TYPE_OPTIONS} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='certificateScore' label='Score' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='certificateIssueDate' label='Issue Date'>
						<MyDatePicker placeholder='Select' style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='certificateIssuer' label='Issuing Organization' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Enter content' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='certificateAttachment' label='Certificate Attachment' rules={[...rules.fileRequired]}>
						<UploadFile buttonDescription='Choose File' maxCount={1} otherProps={{ className: styles.uploadButton }} />
					</Form.Item>
				</Col>
			</Row>
		</Fragment>
	);
};

export default AcademicInformationStep;
