import { Form, FormInstance } from 'antd';
import React, { useEffect } from 'react';

import SortableSection from '../SortableSection';
import SyllabusHeaderSection from './SyllabusHeaderSection';

interface SyllabusSectionsListProps {
	variant: 'editor' | 'preview';
	isLopTinChi?: boolean;
	onRegisterMove?: (move: (from: number, to: number) => void) => void;
	form: FormInstance<any>;
}

const SyllabusListInternal: React.FC<{
	fields: any[];
	move: (from: number, to: number) => void;
	onRegisterMove?: (move: (from: number, to: number) => void) => void;
	variant: string;
	isLopTinChi?: boolean;
	form: FormInstance<any>;
}> = ({ fields, move, onRegisterMove, variant, isLopTinChi, form }) => {
	const formMain = Form.useFormInstance();
	useEffect(() => {
		onRegisterMove?.(move);
	}, [move, onRegisterMove]);

	return (
		<>
			{fields.map((field, index) => {
				const section = formMain.getFieldValue(['noiDung', index]) as Syllabus.INoiDung | undefined;
				if (!section) return null;

				const sectionKey = field.key;

				if (section.loai === 'title') {
					return (
						<div key={sectionKey} id={`section-${index}`} style={{ marginBottom: 16 }}>
							<SyllabusHeaderSection show={section.kichHoat !== false} isPreview={variant === 'preview'} />
						</div>
					);
				}

				return (
					<div key={sectionKey} id={`section-${index}`} style={{ width: '100%' }}>
						<SortableSection
							key={sectionKey}
							section={section}
							field={field}
							isPreview={variant === 'preview'}
							isLopTinChi={isLopTinChi}
							form={form}
						/>
					</div>
				);
			})}
		</>
	);
};

const SyllabusSectionsList: React.FC<SyllabusSectionsListProps> = ({
	variant = 'editor',
	isLopTinChi,
	onRegisterMove,
	form,
}) => {
	return (
		<Form.List name='noiDung'>
			{(fields, { move }) => (
				<SyllabusListInternal
					fields={fields}
					move={move}
					onRegisterMove={onRegisterMove}
					variant={variant}
					isLopTinChi={isLopTinChi}
					form={form}
				/>
			)}
		</Form.List>
	);
};

export default SyllabusSectionsList;
