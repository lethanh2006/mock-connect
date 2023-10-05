import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { Card, List, Progress } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const CardLopHocPhan = () => {
	const { danhSach: danhSachLHP, sinhVienGetAllModel } = useModel('daotao.lophocphan');
	const { getAllModel: getAllHocKy } = useModel('daotao.hocky');

	const getData = async () => {
		getAllHocKy().then((data) => {
			sinhVienGetAllModel({ maHocKy: data?.[0]?.ma, loai: ELoaiLopHocPhan.CHINH });
		});
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<Card title='Lớp học phần'>
			<div
				id='scrollableDiv'
				style={{
					height: 350,
					overflow: 'auto',
				}}
			>
				<List
					itemLayout='horizontal'
					dataSource={danhSachLHP}
					renderItem={(item) => (
						<List.Item style={{ cursor: 'pointer' }} onClick={() => history.push(`/hoc-tap/lop-hoc-phan/${item._id}`)}>
							<List.Item.Meta title={item.hocPhan?.ten} description={`${item.ten}`} />
							<Progress
								style={{ marginRight: 8, marginLeft: 8 }}
								width={50}
								type='dashboard'
								percent={Math.round(
									((item?.thoiKhoaBieuList || [])?.filter((items) => moment().isAfter(items?.ngay)).length /
										(item?.thoiKhoaBieuList || [])?.length) *
										100,
								)}
							/>
						</List.Item>
					)}
				/>
			</div>
		</Card>
	);
};

export default CardLopHocPhan;
