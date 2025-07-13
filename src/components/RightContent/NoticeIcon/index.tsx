import ModalExpandable from '@/components/Table/ModalExpandable';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import NoticeIcon from './NoticeIcon';
import NoticeList from './NoticeList';

const NoticeIconView = () => {
	const intl = useIntl();
	const { record, setRecord, unread, readNotificationModel, page, limit, getThongBaoModel, total } =
		useModel('thongbao.noticeicon');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [visiblePopup, setVisiblePopup] = useState<boolean>(false);

	useEffect(() => {
		getThongBaoModel();
	}, [page, limit]);

	const clearReadState = async () => {
		readNotificationModel('ALL');
		setVisiblePopup(false);
	};

	return (
		<>
			<NoticeIcon
				total={total}
				count={unread}
				popupVisible={visiblePopup}
				onPopupVisibleChange={(visible) => setVisiblePopup(visible)}
				allowClear={!!unread}
				onClear={clearReadState}
			>
				<NoticeList
					onClick={(item) => {
						setRecord(item);
						setVisibleDetail(true);
						setVisiblePopup(false);
					}}
				/>
			</NoticeIcon>

			<ModalExpandable
				width={800}
				styles={{ body: { padding: 0 } }}
				destroyOnClose
				onCancel={() => setVisibleDetail(false)}
				open={visibleDetail}
				footer={null}
			>
				<ViewThongBao
					record={record}
					afterViewDetail={() => {
						setVisibleDetail(false);
						setVisiblePopup(false);
					}}
				/>

				<div className='form-footer'>
					<Button onClick={() => setVisibleDetail(false)}>
						{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
					</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default NoticeIconView;
