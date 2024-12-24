import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ApiOutlined, ReloadOutlined } from '@ant-design/icons';
import { Col, Descriptions, Progress, Row, Spin, Tag } from 'antd';
import moment from 'moment';
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
			width: 180,
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
			width: 130,
			align: 'center',
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
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
			<div style={{ marginBottom: 12 }}>
				<ButtonExtend
					key={'2'}
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
			</div>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
						<Descriptions.Item label='Tên học phần'>{record?.hocPhan?.ten ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tiến trình hoàn thiện'>
							<Progress percent={record?.tiLeHoanThanh ?? 0} />
						</Descriptions.Item>
						<Descriptions.Item label='Vào lớp'>{record?.thoiGianTaoVao ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Cập nhật gần nhất'>{record?.thoiGianCapNhatGanNhatVao ?? '--'}</Descriptions.Item>
					</Descriptions>
				</Col>
				<Col span={24}>
					<div className='fw500' style={{ marginBottom: 12 }}>
						Danh sách bài giảng/ Học liệu
					</div>

					<TableStaticData
						columns={columns}
						data={record?.hocLieu ?? []}
						addStt
						size='small'
						otherProps={{ pagination: true }}
						hasTotal
					>
						<ButtonExtend size='small' icon={<ReloadOutlined />} onClick={() => getData()}>
							Tải lại
						</ButtonExtend>
					</TableStaticData>
				</Col>
			</Row>
		</Spin>
	);
};

export default LmsOdooPage;
