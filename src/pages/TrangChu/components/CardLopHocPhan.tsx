import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { Card, List } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

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
						<List.Item>
							<List.Item.Meta title={item.hocPhan?.ten} description={`${item.ten}`} />
						</List.Item>
					)}
				/>
			</div>
		</Card>
	);
};

export default CardLopHocPhan;
