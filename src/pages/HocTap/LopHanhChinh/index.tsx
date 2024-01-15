import { Card, Empty, Tabs } from 'antd';
import { useModel } from 'umi';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';
import SelectLopHanhChinhSinhVien from './components/Select';
import { useEffect } from 'react';

const LopHanhChinhPage = () => {
	const { record, sinhVienGetByIdModel, setRecord, danhSach } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		if (record?._id) sinhVienGetByIdModel(record._id);
	}, [record?._id]);

	return (
		<Card
			bodyStyle={{ paddingTop: 4 }}
			title='Lớp hành chính'
			extra={
				<SelectLopHanhChinhSinhVien
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
					style={{ width: 180 }}
					hasDefault
				/>
			}
		>
			{record?._id ? (
				<>
					<Tabs>
						<Tabs.TabPane tab='Thông tin chung' key={0}>
							<ThongTinChungLopHanhChinh />
						</Tabs.TabPane>
						{/* <Tabs.TabPane tab='Thông báo' key={1}>
					Thông báo
				</Tabs.TabPane> */}
					</Tabs>
				</>
			) : (
				<Empty description='Vui lòng chọn lớp hành chính' style={{ margin: '32px 0' }} />
			)}
		</Card>
	);
};

export default LopHanhChinhPage;
