import styles from '@/components/RightContent/NoticeIcon/NoticeList.less';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import type { ThongBao } from '@/services/ThongBao/typing';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Modal } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const CardThongBao = () => {
	const { danhSach, getThongBaoLopModel, setRecord, record } = useModel('thongbao.thongbao');
	const { record: recLopHp } = useModel('lophocphan.lophocphan');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	useEffect(() => {
		if (recLopHp?._id) getThongBaoLopModel(recLopHp._id, 'lop-hoc-phan', 1, 5);
	}, [recLopHp?._id]);

	return (
		<Card
			title='Thông báo'
			bodyStyle={{ padding: 0 }}
			extra={[
				<ButtonExtend
					key='all'
					onClick={() => (window.location.hash = 'thong-bao')}
					type='link'
					icon={<ArrowRightOutlined />}
					tooltip='Xem tất cả'
				/>,
			]}
		>
			<List<ThongBao.IRecord>
				className={styles.list}
				dataSource={danhSach}
				renderItem={(item) => {
					const leftIcon = item.imageUrl ? <Avatar className={styles.avatar} src={item.imageUrl} /> : null;

					return (
						<List.Item
							className={styles.item}
							key={item._id}
							onClick={() => {
								setRecord(item);
								setVisibleThongBao(true);
							}}
						>
							<List.Item.Meta
								className={styles.meta}
								avatar={leftIcon}
								title={
									<div className={styles.title}>
										{item.title}
										{/* <div className={styles.extra}>{item.extra}</div> */}
									</div>
								}
								description={
									<>
										<div className={styles.description}>{item.description}</div>
										<div className={styles.datetime}>{moment(item.createdAt).fromNow()}</div>
									</>
								}
							/>
						</List.Item>
					);
				}}
			/>

			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				destroyOnClose
				onCancel={() => setVisibleThongBao(false)}
				visible={visibleThongBao}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
			>
				<ViewThongBao record={record} />
			</Modal>
		</Card>
	);
};

export default CardThongBao;
