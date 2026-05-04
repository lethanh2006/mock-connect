import { Descriptions, Form, Input, Space, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

const FacultyTextInput: React.FC<{ placeholder: string }> = ({ placeholder }) => <Input placeholder={placeholder} />;

const FacultyTextareaInput: React.FC<{ placeholder: string }> = ({ placeholder }) => (
	<Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder={placeholder} />
);

type ProviderFieldKey =
	| 'providerFacultyName'
	| 'providerFacultyEmail'
	| 'providerFacultyScheduleInfo'
	| 'providerTAName'
	| 'providerTAEmail'
	| 'providerTAScheduleInfo';

type RowConfig = {
	label: string;
	name: ProviderFieldKey;
	component: React.ComponentType<{ placeholder: string }>;
	placeholder: string;
};

interface Props {
	index?: number;
}

const FacultyTaContent: React.FC<Props> = ({ index }) => {
	const form = Form.useFormInstance();
	const noiDung = form?.getFieldValue(['noiDung', index]);

	const facultyRows: RowConfig[] = [
		{
			label: 'Faculty name',
			name: 'providerFacultyName',
			component: FacultyTextInput,
			placeholder: 'Enter faculty name',
		},
		{
			label: 'Faculty email',
			name: 'providerFacultyEmail',
			component: FacultyTextInput,
			placeholder: 'Enter faculty email',
		},
		{
			label: 'Office hour schedule and booking mechanism (if any)',
			name: 'providerFacultyScheduleInfo',
			component: FacultyTextareaInput,
			placeholder: 'Example: Monday 14:00-16:00, room 301; book via email...',
		},
	];

	const taRows: RowConfig[] = [
		{
			label: 'TA name',
			name: 'providerTAName',
			component: FacultyTextInput,
			placeholder: 'Enter TA name',
		},
		{
			label: 'TA email',
			name: 'providerTAEmail',
			component: FacultyTextInput,
			placeholder: 'Enter TA email',
		},
		{
			label: 'Office hour schedule and booking mechanism (if any)',
			name: 'providerTAScheduleInfo',
			component: FacultyTextareaInput,
			placeholder: 'Example: Wednesday 10:00-12:00, room 202; book via email...',
		},
	];
	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Form.Item shouldUpdate noStyle>
				{() => {
					return (
						<Space direction='vertical' size='small' style={{ width: '100%' }}>
							<Space direction='vertical' size='small' style={{ width: '100%' }}>
								<Title level={4}>Faculty Information</Title>
								<Descriptions column={1} size='small' labelStyle={{ width: 420 }}>
									{facultyRows.map((row) => (
										<Descriptions.Item key={row.name} label={<Text strong>{row.label}</Text>}>
											<div style={{ fontSize: 12, width: '100%' }}>{noiDung?.[row.name]}</div>
										</Descriptions.Item>
									))}
								</Descriptions>
							</Space>

							<Space direction='vertical' size={0}>
								<Title level={4}>Teaching Assistant Information</Title>
								<Descriptions column={1} size='small' labelStyle={{ width: 420 }}>
									{taRows.map((row) => (
										<Descriptions.Item key={row.name} label={<Text strong>{row.label}</Text>}>
											<div style={{ fontSize: 12, width: '100%' }}>{noiDung?.[row.name]}</div>
										</Descriptions.Item>
									))}
								</Descriptions>
							</Space>
						</Space>
					);
				}}
			</Form.Item>
		</Space>
	);
};

export default FacultyTaContent;
