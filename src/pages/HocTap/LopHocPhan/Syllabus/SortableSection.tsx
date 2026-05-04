import { Card, Col, Divider, Form, Row } from 'antd';
import React from 'react';
import { AVAILABLE_SECTION_TYPES } from './constants';
import AssessmentEditorSection from './sections/AssessmentEditorSection';
import CloContent from './sections/CloContent';
import CourseDetailsContent from './sections/CourseDetailsContent';
import FacultyTaContent from './sections/FacultyTaContent';
import InstitutionalPoliciesSection from './sections/InstitutionalPoliciesSection';

interface SortableSectionProps {
	section: any;
	field: any;
	isLopTinChi?: boolean;
	form?: any;
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, field, isLopTinChi }) => {
	const form = Form.useFormInstance();
	const template = AVAILABLE_SECTION_TYPES.find((t) => t.tieuDe === section.tieuDe);
	Form.useWatch(['noiDung', field.name, 'noiDung'], form);

	const renderSectionContent = () => {
		switch (template?.tieuDe) {
			case 'Course Overview':
				return <CourseDetailsContent formMain={form} />;
			case 'Faculty and Teaching Assistant Information':
				return <FacultyTaContent index={field.name} />;
			case 'Learning Framework':
				return <CloContent index={field.name} isLopTinChi={isLopTinChi} />;
			case 'Assessment':
				return <AssessmentEditorSection fieldName={field.name} formMain={form} section={section} />;
			case 'Institutional Policies':
				return <InstitutionalPoliciesSection />;
			default:
				return (
					<Form.Item name={[field.name, 'noiDung']} noStyle>
						<div
							dangerouslySetInnerHTML={{
								__html: section.noiDung || '',
							}}
						/>
					</Form.Item>
				);
		}
	};

	return (
		<Card className='card-borderless card-big-title' variant='borderless' title={null}>
			<Row align='middle'>
				<Col span={24}>
					<Divider className='divider-big-title divider-syllabus-section' style={{ fontSize: 22 }} orientation='left'>
						{template?.tieuDe || section.tieuDe}
					</Divider>
				</Col>
			</Row>
			{renderSectionContent()}
		</Card>
	);
};

export default SortableSection;
