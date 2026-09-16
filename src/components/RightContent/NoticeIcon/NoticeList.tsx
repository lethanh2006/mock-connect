import { type ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { IconArrowDown, IconArrowUp, IconButton } from '@/components/Icons';
import { Avatar, Divider, List, Skeleton } from 'antd';
import classNames from 'classnames';

import React, { useEffect, useRef, useState } from 'react';
import { Link, useIntl, useModel } from 'umi';
import styles from './index.less';

export type NoticeIconTabProps = {
	onClick?: (item: ThongBao.IRecord) => void;
	emptyText?: string;
	viewMoreText?: string;
};

const NoticeList: React.FC<NoticeIconTabProps> = ({
	onClick,
	emptyText = 'Bạn đã xem tất cả thông báo',
	viewMoreText = 'Tải thêm',
}) => {
	const intl = useIntl();
	const { total, readNotificationModel, danhSach, loading, setPage, page } = useModel('thongbao.noticeicon');
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const prevLengthRef = useRef(danhSach?.length ?? 0);

	const hasData = !!danhSach && danhSach.length > 0;

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		const onScroll = () => setShowScrollTop(el.scrollTop > 200);
		el.addEventListener('scroll', onScroll);
		return () => el.removeEventListener('scroll', onScroll);
	}, [hasData]);

	// Tải thêm thì cuộn thêm 1 màn hình để lộ nội dung mới; lần mở panel đầu (page=1) thì giữ nguyên vị trí.
	useEffect(() => {
		const prevLength = prevLengthRef.current;
		const nextLength = danhSach?.length ?? 0;
		prevLengthRef.current = nextLength;
		const el = scrollRef.current;
		if (page > 1 && nextLength > prevLength && el) {
			el.scrollTo({ top: el.scrollTop + el.clientHeight, behavior: 'smooth' });
		}
	}, [danhSach?.length, page]);

	// Tách "đang tải lần đầu" khỏi "trống thật" để không hiện nhầm empty-state lúc chờ API.
	if (loading && !hasData) {
		return <Skeleton paragraph={{ rows: 4 }} active style={{ padding: 12 }} />;
	}

	if (!hasData) {
		return (
			<div className={styles.notFound}>
				<img src='https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg' alt='not found' />
				<div>{emptyText}</div>
			</div>
		);
	}

	const hasMore = danhSach.length < total;

	const onItemClick = (item: ThongBao.IRecord) => {
		if (!item.read) readNotificationModel('ONE', item?._id);
		onClick?.(item);
	};

	// Chỉ tải thêm khi người dùng bấm nút — không tự tải theo cuộn.
	const onViewMore = () => {
		if (loading || !hasMore) return;
		setPage((p) => p + 1);
	};

	return (
		<div className='notice-list'>
			<div id='scrollableDiv' className='notice-list-scroll' ref={scrollRef}>
				<List<ThongBao.IRecord>
					className={styles.list}
					dataSource={danhSach}
					renderItem={(item) => {
						const itemCls = classNames(styles.item, { [styles.read]: !item.read });
						const leftIcon = item.imageUrl ? <Avatar className={styles.avatar} src={item.imageUrl} /> : null;

						return (
							<List.Item className={itemCls} key={item._id} onClick={() => onItemClick(item)}>
								<List.Item.Meta
									className={styles.meta}
									avatar={leftIcon}
									title={<div className={styles.title}>{item.title}</div>}
									description={
										<>
											<div className={styles.description}>{item.description}</div>
											<div className={styles.datetime}>{dayjs(item.createdAt).fromNow()}</div>
										</>
									}
								/>
							</List.Item>
						);
					}}
				/>
				{loading ? <Skeleton paragraph={{ rows: 2 }} active style={{ padding: 12 }} /> : null}
				{!hasMore ? <Divider plain>{emptyText}</Divider> : null}
			</div>

			{showScrollTop ? (
				<IconButton
					label={intl.formatMessage({ id: 'app.header.scrolltop', defaultMessage: 'Lên đầu trang' })}
					variant='outline'
					size='sm'
					className='notice-list-scroll-top'
					onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					<IconArrowUp size={14} />
				</IconButton>
			) : null}

			<div className={styles.bottomBar}>
				<Link
					className='notice-list-loadmore'
					to='#!'
					onClick={(e) => {
						e.preventDefault();
						onViewMore?.();
					}}
				>
					<IconArrowDown size={14} /> {viewMoreText}
				</Link>
			</div>
		</div>
	);
};

export default NoticeList;
