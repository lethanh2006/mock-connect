import ModalExpandable from '@/components/Table/ModalExpandable';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { IconButton, IconDoubleCheck, IconRotateArrow, SidebarView } from '@/components/Icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import NoticeList from './NoticeList';
import styles from './index.less';
import './style.less';

const NoticePanel = () => {
	const intl = useIntl();
	const { record, setRecord, unread, readNotificationModel, page, limit, getThongBaoModel, total, loading } =
		useModel('thongbao.noticeicon');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);

	useEffect(() => {
		getThongBaoModel();
	}, [page, limit]);

	const clearReadState = async () => {
		await readNotificationModel('ALL', undefined, intl.formatMessage({ id: 'global.noticeion.all' }));
	};

	return (
		<SidebarView value='notifications' className='notice-panel'>
			<div className='notice-panel-header'>
				<span>
					{intl.formatMessage({ id: 'app.header.noti', defaultMessage: 'Thông báo của tôi' })} ({total ?? 0})
				</span>
				<div className='notice-panel-actions'>
					<IconButton
						label={intl.formatMessage({ id: 'app.header.reload', defaultMessage: 'Làm mới' })}
						variant='ghost'
						size='sm'
						onClick={() => getThongBaoModel()}
					>
						<IconRotateArrow className={classNames(styles.reloadIcon, loading && styles.spinning)} />
					</IconButton>
					<IconButton
						label={intl.formatMessage({ id: 'app.header.readAll', defaultMessage: 'Đánh dấu tất cả là đã đọc' })}
						variant='ghost'
						size='sm'
						disabled={!unread}
						onClick={clearReadState}
					>
						<IconDoubleCheck />
					</IconButton>
				</div>
			</div>

			<div className={classNames('notice-panel-list', styles.noticeContainer)}>
				<NoticeList
					onClick={(item) => {
						setRecord(item);
						setVisibleDetail(true);
					}}
					emptyText={intl.formatMessage({ id: 'global.rightcontent.thongbao.emptytext' })}
					viewMoreText={intl.formatMessage({ id: 'global.rightcontent.thongbao.taithem' })}
				/>
			</div>

			<ModalExpandable
				width={800}
				onCancel={() => setVisibleDetail(false)}
				open={visibleDetail}
				title={record?.title || 'Thông báo'}
			>
				<ViewThongBao
					record={record}
					afterViewDetail={() => {
						setVisibleDetail(false);
					}}
					hideCard
				/>
			</ModalExpandable>
		</SidebarView>
	);
};

export default NoticePanel;
