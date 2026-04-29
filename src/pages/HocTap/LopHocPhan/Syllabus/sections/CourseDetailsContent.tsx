import { useModel } from '@umijs/max';
import { Descriptions, Form, FormInstance, Space, Typography } from 'antd';
import React from 'react';

const { Title, Text, Link } = Typography;

interface Props {
	readonly?: boolean;
	formMain: FormInstance<any>;
}

const CourseDetailsContent: React.FC<Props> = ({ readonly, formMain }) => {
	const { record } = useModel('lophocphan.lophocphan');
	const deCuongFull = Form.useWatch('deCuong', formMain);
	const { danhSach } = useModel('hocphan.hocphan');
	const maHocPhan = Form.useWatch('maHocPhan', formMain);
	const hocPhan = danhSach?.find((d) => d.ma === maHocPhan);

	const rows = [
		{ label: 'School', value: record?.csdt ? `${record?.csdt?.diaChi} - ${record?.csdt?.ten}` : record?.csdt?.diaChi },
		{ label: 'Term', value: record?.hocKy?.ten },
		{ label: 'Course Number', value: hocPhan ? hocPhan?.ma : record?.hocPhan?.ma },
		{ label: 'Course Title', value: hocPhan ? hocPhan?.ten : record?.hocPhan?.ten },
		{ label: 'Credit Value', value: hocPhan ? hocPhan?.soTinChi : record?.hocPhan?.soTinChi },
		{
			label: 'Requisites',
			value: null,
		},
		{ label: 'Class Size', value: record?.siSo },
		{ label: 'Class Location', value: record?.phongHoc },
	];

	return (
		<Form.Item shouldUpdate noStyle>
			{() => {
				return (
					<Space direction='vertical' size='small'>
						<Title level={4}>Course Details</Title>
						<Descriptions column={1} size='small' labelStyle={{ width: 220 }}>
							{rows.map((row) => (
								<Descriptions.Item key={row.label} label={<Text strong>{row.label}</Text>}>
									{row.value != null && row.value !== '' ? row.value : null}
								</Descriptions.Item>
							))}
						</Descriptions>

						<Descriptions column={1} size='small' layout='vertical'>
							<Descriptions.Item label={<Text>Introduction Video</Text>}>
								{deCuongFull?.urlHuongDan && (
									<Link href={deCuongFull.urlHuongDan} target='_blank'>
										{deCuongFull.urlHuongDan}
									</Link>
								)}
							</Descriptions.Item>

							<Descriptions.Item label={<Text>Course Goals</Text>}>
								{deCuongFull?.mucTieuHocPhan && (
									<div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: deCuongFull.mucTieuHocPhan }} />
								)}
							</Descriptions.Item>

							<Descriptions.Item label={<Text>Methodology</Text>}>
								{deCuongFull?.phuongPhapGiangDay && (
									<div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: deCuongFull.phuongPhapGiangDay }} />
								)}
							</Descriptions.Item>

							<Descriptions.Item label={<Text>Course Themes</Text>}>
								{deCuongFull?.chuanDauRa && (
									<div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: deCuongFull.chuanDauRa }} />
								)}
							</Descriptions.Item>
						</Descriptions>
					</Space>
				);
			}}
		</Form.Item>
	);
};

export default CourseDetailsContent;
