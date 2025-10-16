import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';
import { ApiOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Progress, Row, Spin, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const LmsOdooPage = (props: { idLopHocPhan: string }) => {
	const { idLopHocPhan } = props;
	const { getByIdModel, record, loading } = useModel('lophocphan.lmsodoo');

	const getData = () => {
		if (idLopHocPhan) getByIdModel(`lop-hoc-phan/${idLopHocPhan}/me/info`);
	};

	useEffect(() => {
		getData();
	}, [idLopHocPhan]);

	const columns: IColumn<LopHocPhan.THocLieuLms>[] = [
		{
			title: 'Tên bài giảng/ Học liệu',
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: 'Số lần làm bài',
			dataIndex: 'soLanLamBaiKiemTra',
			width: 100,
			align: 'center',
			sortable: true,
		},
		{
			title: 'Thời gian hoàn thành',
			dataIndex: 'thoiGianHoanThanh',
			width: 130,
			align: 'center',
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'hoanThanh',
			align: 'center',
			width: 100,
			render: (val, rec) => (val ? <Tag color='green'>Đã hoàn thành</Tag> : <Tag color='red'>Chưa hoàn thành</Tag>),
		},
	];

	return (
		<Spin spinning={loading}>
			<ButtonExtend
				style={{ marginBottom: 16 }}
				type='primary'
				icon={<ApiOutlined />}
				onClick={() => {
					if (idLopHocPhan) {
						getByIdModel(`lop-hoc-phan/${idLopHocPhan}/url/sv`, false).then((res: any) => {
							if (res) {
								window.open(res, '_blank');
							} else {
								console.error('URL not found in response:', res);
							}
						});
					}
				}}
			>
				Lớp học LMS
			</ButtonExtend>

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card variant='borderless'>
						<div className='fw500' style={{ marginBottom: 12, fontSize: 16 }}>
							Thông tin lớp
						</div>
						<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
							<Descriptions.Item label='Tên học phần'>{record?.hocPhan?.ten ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Tiến trình hoàn thiện'>
								<Progress percent={record?.tiLeHoanThanh ?? 0} />
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian vào lớp'>
								{record?.thoiGianTaoVao ? dayjs(record?.thoiGianTaoVao).format('HH:mm DD/MM/YYYY') : '--'}
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian cập nhật gần nhất'>
								{record?.thoiGianCapNhatGanNhatVao
									? dayjs(record?.thoiGianCapNhatGanNhatVao).format('HH:mm DD/MM/YYYY')
									: '--'}
							</Descriptions.Item>
						</Descriptions>
					</Card>
				</Col>

				<Col span={24}>
					<Card variant='borderless'>
						<div className='fw500' style={{ marginBottom: 12, fontSize: 16 }}>
							Danh sách bài giảng/ Học liệu
						</div>

						<TableStaticData columns={columns} data={record?.hocLieu ?? []} addStt hasTotal onReload={getData} />
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default LmsOdooPage;
