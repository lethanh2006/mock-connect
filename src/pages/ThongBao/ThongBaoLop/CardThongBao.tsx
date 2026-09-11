import PageCard from '@/components/PageCard';
import styles from '@/components/RightContent/NoticeIcon/index.less';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import type { ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { IconArrowRight } from '@/components/Icons';
import { Avatar, List, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const CardThongBao = (props: { loai: 'lop-hanh-chinh' | 'lop-hoc-phan'; idLop?: string; onShowAll?: () => void }) => {
	const intl = useIntl();
	const { danhSach, getThongBaoLopModel, setRecord, record } = useModel('thongbao.thongbaolop');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	useEffect(() => {
		if (props.idLop) {
			getThongBaoLopModel(props.idLop, props.loai);
		}
	}, [props.idLop, props.loai]);

	return (
		<PageCard
			level={2}
			hideInnerCard
			size='small'
			title={intl.formatMessage({ id: 'thongbaolop.title' })}
			className={styles.list}
			extra={
				<ButtonExtend
					onClick={() => {
						props.onShowAll?.();
					}}
					type='link'
					icon={<IconArrowRight />}
				>
					{intl.formatMessage({ id: 'trangchu.xemtatca' })}
				</ButtonExtend>
			}
		>
			<List
				dataSource={danhSach.slice(0, 5)}
				renderItem={(item: ThongBao.IRecord) => (
					<List.Item
						onClick={() => {
							setRecord(item);
							setVisibleThongBao(true);
						}}
						key={item._id}
						className={styles.item}
					>
						<List.Item.Meta
							avatar={<Avatar src={item.imageUrl} />}
							title={<div className={styles.title}>{item.title}</div>}
							description={
								<>
									<div className={styles.description}>{item.description}</div>
									<div className={styles.datetime}>{dayjs(item.createdAt).fromNow()}</div>
								</>
							}
						/>
					</List.Item>
				)}
			/>
			<Modal
				title={intl.formatMessage({ id: 'thongbao.detail.title' })}
				open={visibleThongBao}
				onCancel={() => setVisibleThongBao(false)}
				footer={null}
				width={800}
				destroyOnClose
			>
				<ViewThongBao record={record} />
			</Modal>
		</PageCard>
	);
};

export default CardThongBao;
