import { useModel } from 'umi';
import NoticeIcon from './NoticeIcon';

const NoticeIconView = () => {
	const { unread } = useModel('thongbao.noticeicon');

	return <NoticeIcon count={unread} />;
};

export default NoticeIconView;
