import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import NoticeIcon from './NoticeIcon';
import NoticeList from './NoticeList';

const NoticeIconView = () => {
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

			<Modal
				width={800}
				styles={{ content: { padding: 0 } }}
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

				<div className='form-footer' style={{ paddingBottom: 12 }}>
					<Button onClick={() => setVisibleDetail(false)}>Đóng</Button>
				</div>
			</Modal>
		</>
	);
};

export default NoticeIconView;
