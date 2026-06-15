import { useModel } from '@umijs/max';
import { Form, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

interface SyllabusHeaderSectionProps {
	show?: boolean;
	isPreview?: boolean;
}

const SyllabusHeaderSection: React.FC<SyllabusHeaderSectionProps> = ({ show = true, isPreview }) => {
	const { record } = useModel('lophocphan.lophocphan');
	const { danhSach } = useModel('hocphan.hocphan');
	const form = Form.useFormInstance();
	const maHocPhan = Form.useWatch('maHocPhan', form);
	const hocPhan = danhSach?.find((d) => d.ma === maHocPhan);
	const deCuong = Form.useWatch('deCuong', form);

	if (!show) return null;
	return (
		<Title
			level={3}
			style={{
				textAlign: 'center',
				textTransform: 'uppercase',
				marginBottom: 0,
			}}
		>
			VinUniversity - {record?.hocPhan?.ten ?? hocPhan?.ten ?? deCuong?.hocPhan?.ten ?? ''}
		</Title>
	);
};

export default SyllabusHeaderSection;
