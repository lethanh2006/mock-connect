import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';

const DetailLopHanhChinh = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { record, sinhVienGetByIdModel } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		if (id) sinhVienGetByIdModel(id);
	}, [id]);

	return (
		<Card
			bodyStyle={{ paddingTop: 4 }}
			title={
				<Breadcrumb style={{ cursor: 'pointer' }}>
					<Breadcrumb.Item onClick={() => history.push('/lop-hanh-chinh')}>
						<TeamOutlined /> Lớp hành chính
					</Breadcrumb.Item>
					<Breadcrumb.Item>{record?.ten ?? ''}</Breadcrumb.Item>
				</Breadcrumb>
			}
		>
			<Tabs>
				<Tabs.TabPane tab='Thông tin chung' key={0}>
					<ThongTinChungLopHanhChinh />
				</Tabs.TabPane>
				{/* <Tabs.TabPane tab="Thông báo" key={1}>
          Thông báo
        </Tabs.TabPane> */}
			</Tabs>
		</Card>
	);
};

export default DetailLopHanhChinh;
