import type { ComponentProps } from 'react';
import './style.less';

export type TCourseRegistrationStatusVariant = 'success' | 'pending' | 'warning' | 'negative' | 'default';

const CourseRegistrationStatusTag = ({
	variant = 'default',
	className,
	children,
	...props
}: ComponentProps<'span'> & { variant?: TCourseRegistrationStatusVariant }) => (
	<span
		{...props}
		className={`course-registration-status-tag course-registration-status-tag--${variant}${className ? ` ${className}` : ''}`}
	>
		<span className='course-registration-status-tag-label'>{children}</span>
	</span>
);

export default CourseRegistrationStatusTag;
