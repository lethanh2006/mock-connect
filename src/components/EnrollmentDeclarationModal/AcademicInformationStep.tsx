import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTruongThpt from '@/pages/Core/TruongThpt/SelectTruongThpt';
import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Radio, Row, Select, Table, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Fragment, useMemo } from 'react';
import { useIntl, type IntlShape } from 'umi';
import { ENGLISH_CERTIFICATE_TYPE_OPTIONS, PRIORITY_AREA_OPTIONS, PRIORITY_CATEGORY_OPTIONS } from './academicConstants';
import { getTrainingLevelOptions } from './guardianConstants';
import styles from './index.less';
import SectionHeader from './SectionHeader';

type TGradeRow = {
	key: 'diemToan' | 'diemVan' | 'diemTiengAnh' | 'diemLy' | 'diemHoa' | 'diemSinh' | 'diemTrungBinhNam';
	label: string;
};

const getGradeRows = (intl: IntlShape): TGradeRow[] => [
	{ key: 'diemToan', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.math' }) },
	{ key: 'diemVan', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.literature' }) },
	{ key: 'diemTiengAnh', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.english' }) },
	{ key: 'diemLy', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.physics' }) },
	{ key: 'diemHoa', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.chemistry' }) },
	{ key: 'diemSinh', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.biology' }) },
	{ key: 'diemTrungBinhNam', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.yearAvg' }) },
];

const getGradeColumns = (intl: IntlShape): ColumnsType<TGradeRow> => [
	{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subjects' }), dataIndex: 'label', width: 200 },
	...(['10', '11', '12'] as const).map((grade) => ({
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeHeader' }, { grade }),
		key: `grade${grade}`,
		render: (_: unknown, row: TGradeRow) => (
			<Form.Item name={`${row.key}_${grade}`} noStyle>
				<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' })} />
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
	intl,
}: {
	form: FormInstance<any>;
	listTinhTruongThpt?: TruongThpt.ITinhTP[];
	suffix: string;
	isDomestic: boolean;
	intl: IntlShape;
}) => {
	if (isDomestic) {
		return <SelectTruongThpt form={form} suffix={suffix} listTinh={listTinhTruongThpt} />;
	}

	const enterContentText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' });

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item name={`hsCountry${suffix}`} label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.country' })} rules={[...rules.required, ...rules.text]}>
					<SelectQuocTich placeholder={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.country' })} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name={`hsCity${suffix}`} label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.provinceCity' })} rules={[...rules.required, ...rules.text]}>
					<Input placeholder={enterContentText} />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item name={`hsName${suffix}`} label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.highSchoolName' })} rules={[...rules.required, ...rules.text]}>
					<Input placeholder={enterContentText} />
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
	const intl = useIntl();
	const pursuingDegree: boolean | undefined = Form.useWatch('pursuingDegree', form);
	const attendedHighSchoolInVietnam: boolean | undefined = Form.useWatch('attendedHighSchoolInVietnam', form);
	const transferredHighSchool: boolean | undefined = Form.useWatch('transferredHighSchool', form);
	const isDomestic = attendedHighSchoolInVietnam === true;
	const isTransferred = transferredHighSchool === true;

	const yesNoOptions = useMemo(
		() => [
			{ value: true, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.yes' }) },
			{ value: false, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.no' }) },
		],
		[intl],
	);

	const gradeRows = useMemo(() => getGradeRows(intl), [intl]);
	const gradeColumns = useMemo(() => getGradeColumns(intl), [intl]);
	const trainingLevelOptions = useMemo(() => getTrainingLevelOptions(intl), [intl]);

	const enterContentText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' });
	const selectText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.select' });

	return (
		<Fragment>
			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.highSchoolSection' })}</SectionHeader>

			<Form.Item
				name='pursuingDegree'
				label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.pursuingDegree' })}
				rules={[...rules.required]}
			>
				<Radio.Group options={yesNoOptions} />
			</Form.Item>

			{pursuingDegree === true && (
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='universityName' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.universityName' })} rules={[...rules.required, ...rules.text]}>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='universityMajor' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.universityMajor' })} rules={[...rules.required, ...rules.text]}>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='universityDegreeLevel' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.universityDegreeLevel' })} rules={[...rules.required]}>
							<Select placeholder={enterContentText} allowClear options={trainingLevelOptions} />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name='universityFromDate' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.fromDate' })} rules={[...rules.required]}>
							<MyDatePicker pickerStyle='month' format='MM/YYYY' placeholder='mm/yyyy' style={{ width: '100%' }} allowClear />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name='universityToDate' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.toDate' })} rules={[...rules.required]}>
							<MyDatePicker pickerStyle='month' format='MM/YYYY' placeholder='mm/yyyy' style={{ width: '100%' }} allowClear />
						</Form.Item>
					</Col>
				</Row>
			)}

			<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.highSchoolSection' })}</div>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item name='attendedHighSchoolInVietnam' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.attendedInVietnam' })} rules={[...rules.required]}>
						<Radio.Group options={yesNoOptions} />
					</Form.Item>
				</Col>
				{attendedHighSchoolInVietnam && (
					<Col span={24} md={12}>
						<Form.Item
							name='transferredHighSchool'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.transferred' })}
							rules={[...rules.required]}
						>
							<Radio.Group options={yesNoOptions} />
						</Form.Item>
					</Col>
				)}
			</Row>

			{attendedHighSchoolInVietnam !== undefined &&
				(isTransferred ? (
					(['10', '11', '12'] as const).map((grade) => (
						<Fragment key={grade}>
							<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeHighSchool' }, { grade })}</div>
							<HighSchoolBlock form={form} listTinhTruongThpt={listTinhTruongThpt} suffix={grade} isDomestic={isDomestic} intl={intl} />
						</Fragment>
					))
				) : (
					<HighSchoolBlock form={form} listTinhTruongThpt={listTinhTruongThpt} suffix='' isDomestic={isDomestic} intl={intl} />
				))}

			<Row gutter={[12, 0]}>
				{isDomestic && (
					<Fragment>
						<Col span={24} md={8}>
							<Form.Item name='priorityCategory' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.priorityCategory' })}>
								<Select placeholder={enterContentText} allowClear options={PRIORITY_CATEGORY_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='priorityArea' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.priorityArea' })}>
								<Select placeholder={enterContentText} allowClear options={PRIORITY_AREA_OPTIONS} />
							</Form.Item>
						</Col>
					</Fragment>
				)}
				<Col span={24} md={isDomestic ? 8 : 24}>
					<Form.Item name='graduationYear' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.graduationYear' })} rules={[...rules.required, ...rules.number(2100, 1900, false)]}>
						<InputNumber style={{ width: '100%' }} placeholder={enterContentText} />
					</Form.Item>
				</Col>
			</Row>

			<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeSection' })}</div>
			<Table
				className={styles.docTable}
				rowKey='key'
				dataSource={gradeRows}
				columns={gradeColumns}
				pagination={false}
				size='small'
			/>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateSection' })}</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='certificateType' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateType' })} rules={[...rules.required]}>
						<Select placeholder={enterContentText} allowClear options={ENGLISH_CERTIFICATE_TYPE_OPTIONS} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='certificateScore' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateScore' })} rules={[...rules.required, ...rules.text]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item rules={[...rules.required]} name='certificateIssueDate' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateIssueDate' })}>
						<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='certificateIssuer' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateIssuer' })} rules={[...rules.text]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='certificateAttachment' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateAttachment' })} rules={[...rules.fileRequired]}>
						<UploadFile buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.chooseFile' })} maxCount={1} otherProps={{ className: styles.uploadButton }} />
					</Form.Item>
				</Col>
			</Row>
		</Fragment>
	);
};

export default AcademicInformationStep;
