import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { DownOutlined } from '@ant-design/icons';
import { Card, Dropdown, List, Menu, Progress, Space } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import './style.less';

const CardLopHocPhan = () => {
	const { danhSach: danhSachLHP, sinhVienGetAllModel, loading } = useModel('daotao.lophocphan');
	const { getAllModel: getAllHocKy, danhSach, record: recHocKy, setRecord } = useModel('daotao.hocky');

	const getData = () => recHocKy?.ma && sinhVienGetAllModel({ maHocKy: recHocKy?.ma, loai: ELoaiLopHocPhan.CHINH });

	useEffect(() => {
		getAllHocKy(!recHocKy?._id, { ma: -1 }, { active: true }, undefined, 'sinh-vien/me');
	}, []);

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	return (
		<Card
			title='Lớp học phần'
			loading={loading}
			extra={
				<Dropdown
					overlay={
						<Menu style={{ height: 300, overflowY: 'auto' }}>
							{danhSach.map((item) => (
								<Menu.Item onClick={() => setRecord(item)} key={item._id}>
									{item.ten}
								</Menu.Item>
							))}
						</Menu>
					}
					trigger={['click']}
				>
					<a onClick={(e) => e.preventDefault()}>
						<Space>
							<div>
								HK{recHocKy?.soThuTu} {(recHocKy?.namHoc?.namBatDau?.toString() ?? '')?.slice(-2)}-
								{(recHocKy?.namHoc?.namKetThuc?.toString() ?? '')?.slice(-2)}
							</div>
							<DownOutlined />
						</Space>
					</a>
				</Dropdown>
			}
		>
			<div
				id='scrollableDiv'
				style={{
					maxHeight: 350,
					overflow: 'auto',
				}}
			>
				<List
					itemLayout='horizontal'
					className='dashboard-list-lhp'
					dataSource={danhSachLHP}
					renderItem={(item) => (
						<List.Item onClick={() => history.push(`/hoc-tap/lop-hoc-phan/${item._id}`)}>
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
