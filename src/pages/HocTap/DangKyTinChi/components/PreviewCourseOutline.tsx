import ModalExpandable from '@/components/Table/ModalExpandable';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Divider, Tabs } from 'antd';
import { useIntl } from 'umi';

/** Local preview only: no student model updates or requests with fixture IDs. */
const PreviewCourseOutline = ({
	course,
	onClose,
}: {
	course?: Pick<LopHocPhan.IRecord, 'hocPhan' | 'maHocPhan'>;
	onClose: () => void;
}) => {
	const intl = useIntl();
	if (!course) return null;

	return (
		<ModalExpandable
			open
			title={`${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${course.hocPhan?.ten ?? course.maHocPhan}`}
			width={1000}
			footer={null}
			onCancel={onClose}
		>
			<Tabs
				items={[
					{
						key: 'general',
						label: intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung' }),
						children: (
							<>
								<Divider orientation='left'>Course information</Divider>
								<Descriptions column={{ xs: 1, sm: 2 }} size='small'>
									<Descriptions.Item label='Course name'>{course.hocPhan?.ten}</Descriptions.Item>
									<Descriptions.Item label='Course code'>{course.maHocPhan}</Descriptions.Item>
									<Descriptions.Item label='Credits'>{course.hocPhan?.soTinChi}</Descriptions.Item>
									<Descriptions.Item label='College'>College of Engineering and Computer Science</Descriptions.Item>
								</Descriptions>
								<Divider orientation='left'>Curriculum information</Divider>
								<Descriptions column={{ xs: 1, sm: 2 }} size='small'>
									<Descriptions.Item label='Semester'>Semester 1 · 2026–2027</Descriptions.Item>
									<Descriptions.Item label='Knowledge block'>Major requirements</Descriptions.Item>
									<Descriptions.Item label='Course type'>Required</Descriptions.Item>
								</Descriptions>
							</>
						),
					},
				]}
			/>
		</ModalExpandable>
	);
};

export default PreviewCourseOutline;
