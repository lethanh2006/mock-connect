import { Card, Col, Divider, Form, Row } from 'antd';
import * as Diff from 'diff';
import DOMPurify from 'dompurify';
import React from 'react';
import { useAccess } from 'umi';
import { AVAILABLE_SECTION_TYPES } from './constants';
import AssessmentEditorSection from './sections/AssessmentEditorSection';
import CloContent from './sections/CloContent';
import CourseDetailsContent from './sections/CourseDetailsContent';
import CourseScheduleSection from './sections/CourseScheduleSection';
import FacultyTaContent from './sections/FacultyTaContent';
import InstitutionalPoliciesSection from './sections/InstitutionalPoliciesSection';

const DIFF_STYLES = {
	removed: {
		table:
			'background-color: #fff1f0; border: 1px dashed #ffa39e; padding: 12px; margin: 8px 0; border-radius: 4px; opacity: 0.8;',
		text: 'background-color: #fff1f0; border-left: 4px solid #ff4d4f; padding: 4px 12px; margin: 4px 0; text-decoration: line-through; opacity: 0.6;',
		label: 'font-size: 11px; font-weight: bold; color: #cf1322; margin-bottom: 4px; text-decoration: none !important;',
		tag: '[Old content]',
	},
	added: {
		table: 'background-color: #f6ffed; border: 1px solid #b7eb8f; padding: 12px; margin: 8px 0; border-radius: 4px;',
		text: 'background-color: #fffbe6; border-left: 4px solid #faad14; padding: 4px 12px; margin: 4px 0;',
		label: 'font-size: 11px; font-weight: bold; color: #d48806; margin-bottom: 4px;',
		tag: '[New content]',
	},
};

interface SortableSectionProps {
	section: Syllabus.INoiDung;
	sectionCu?: Syllabus.INoiDung;
	field: any;
	isPreview?: boolean;
	isLopTinChi?: boolean;
	isComparing?: boolean;
	/** Passed by parent list; section reads `Form.useFormInstance()` instead. */
	form?: unknown;
}

const SortableSection: React.FC<SortableSectionProps> = ({
	section,
	sectionCu,
	field,
	isPreview = false,
	isLopTinChi,
	isComparing,
}) => {
	const { cctFilter } = useAccess();
	const isVinUniSyllabusPrint = cctFilter?.() ?? false;
	const form = Form.useFormInstance();
	const template = AVAILABLE_SECTION_TYPES.find((t) => t.tieuDe === section.tieuDe);
	Form.useWatch(['noiDung', field.name, 'noiDung'], form);

	const renderDiffContent = (oldHtml: string, newHtml: string) => {
		const parseBlocks = (html: string) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			return Array.from(doc.body.children).map((el) => el.outerHTML);
		};

		const oldBlocks = parseBlocks(oldHtml);
		const newBlocks = parseBlocks(newHtml);

		const diffs = Diff.diffArrays(oldBlocks, newBlocks);

		return diffs
			.map((part) => {
				if (part.removed || part.added) {
					const type = part.removed ? 'removed' : 'added';
					const styles = DIFF_STYLES[type];
					return part.value
						.map((val) => {
							const isTable = val.trim().startsWith('<table');
							const style = isTable ? styles.table : styles.text;
							return `<div style="${style}">
								<div style="${styles.label}">${styles.tag}</div>
								${val}
							</div>`;
						})
						.join('');
				}
				return part.value.join('');
			})
			.join('');
	};

	const renderSectionContent = () => {
		const showDiff = isComparing && isPreview && sectionCu;

		switch (template?.tieuDe) {
			case 'Course Overview':
				return <CourseDetailsContent formMain={form} readonly={isPreview} />;
			case 'Faculty and Teaching Assistant Information':
				return <FacultyTaContent index={field.name} readonly={isPreview} />;
			case 'Learning Framework':
				return <CloContent index={field.name} readonly={isPreview} isLopTinChi={isLopTinChi} />;
			case 'Institutional Policies':
				return <InstitutionalPoliciesSection />;
			case 'Assessment':
				return <AssessmentEditorSection fieldName={field.name} formMain={form} section={section} />;
			case 'Course Schedule':
				return <CourseScheduleSection formMain={form} />;
			default:
				return (
					<Form.Item name={[field.name, 'noiDung']} noStyle>
						<div
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(
									showDiff
										? renderDiffContent(sectionCu.noiDung || '', section.noiDung || '')
										: section.noiDung || '',
								),
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
					<Divider
						className={`${isVinUniSyllabusPrint ? 'divider-big-title divider-syllabus-vin-print' : ''} divider-syllabus-section`}
						style={{ fontSize: 22 }}
						orientation='left'
					>
						{isVinUniSyllabusPrint ? (
							<span className='syllabus-section-divider-label'>
								<span className='syllabus-section-print-arrow' aria-hidden>
									<svg width='10' height='12' viewBox='0 0 10 12' xmlns='http://www.w3.org/2000/svg' focusable='false'>
										<path d='M0 0 L10 6 L0 12 Z' fill='#c72127' />
									</svg>
								</span>
								{template?.tieuDe || section.tieuDe}
							</span>
						) : (
							template?.tieuDe || section.tieuDe
						)}
					</Divider>
				</Col>
			</Row>
			{renderSectionContent()}
		</Card>
	);
};

export default SortableSection;
