import { useModel } from '@umijs/max';
import { Form, FormInstance } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { buildCourseScheduleHtml } from '../constants/defaultSectionHtml';
import { sanitizeObject } from '@/utils/utils';

interface CourseScheduleSectionProps {
	formMain: FormInstance;
}

const CourseScheduleSection: React.FC<CourseScheduleSectionProps> = ({ formMain }) => {
	const { danhSach: lichTrinhChungList, getAllModel } = useModel('hocphan.noidunghp');
	const deCuong = Form.useWatch('deCuong', formMain);

	useEffect(() => {
		if (!deCuong?._id) return;
		getAllModel(undefined, { thuTuHienThi: 1 }, { deCuongHpId: deCuong._id });
	}, [deCuong?._id]);

	const tableHtml = useMemo(() => buildCourseScheduleHtml(lichTrinhChungList), [lichTrinhChungList]);

	return <div className='syllabus-course-schedule-section' dangerouslySetInnerHTML={{ __html: sanitizeObject(tableHtml) }} />;
};

export default CourseScheduleSection;
