import type { ChatbotAmi } from '@/services/TienIch/Chatbot/typing';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ContentBoxChat = () => {
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach, formSubmiting, formSubmitingThread } = useModel('tienich.chatbot');
	const lastNameChar = recSinhVien?.ten?.split(' ')?.at(-1)?.[0];

	useEffect(() => {
		let targetId: string | null = null;

		if (formSubmiting || formSubmitingThread) {
			targetId = 'tidot_loading';
		} else {
			targetId = danhSach.at(-1)?._id || null;
		}

		if (targetId) {
			const el = document.getElementById(targetId);
			if (el) {
				setTimeout(() => {
					el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				}, 100);
			}
		}
	}, [danhSach.length, formSubmiting, formSubmitingThread]);

	const MyMessage = ({ message }: { message: ChatbotAmi.IRecord }) => (
		<div className='message-content user-message'>
			<div className='message-text'>
				<div className='message-bubble'>{message.content}</div>
				<div className='message-time'>{moment(message.createdAt).format('HH:mm')}</div>
			</div>
			<div className='message-avatar' style={{ marginLeft: 8 }}>
				<Avatar
					src={recSinhVien?.anhDaiDienUrl}
					icon={!recSinhVien?.anhDaiDienUrl ? lastNameChar || <UserOutlined /> : undefined}
					className='user-avatar'
				/>
			</div>
		</div>
	);

	const BotMessage = ({ message }: { message: ChatbotAmi.IRecord }) => (
		<div className='message-content bot-message'>
			<div className='message-avatar' style={{ marginRight: 8 }}>
				<Avatar src='/images/chatbot_ava.png' className='bot-avatar' />
			</div>
			<div className='message-text'>
				<div className='message-bubble' dangerouslySetInnerHTML={{ __html: message.content }} />
				<div className='message-meta'>
					<span className='message-time'>{moment(message.createdAt).format('HH:mm')}</span>
					<span className='message-name'>Ami</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className='messages-container'>
			<div className='messages'>
				{danhSach.map((item) => (
					<div className={classNames('message-wrapper', { bot: !item.isUser })} key={item._id} id={item._id}>
						{item.isUser ? <MyMessage message={item} /> : <BotMessage message={item} />}
					</div>
				))}
				{(formSubmiting || formSubmitingThread) && (
					<div className='message-wrapper bot' id='tidot_loading'>
						<div className='message-content bot-message'>
							<div className='message-avatar' style={{ marginRight: 8 }}>
								<Avatar src='/images/chatbot_ava.png' className='bot-avatar' />
							</div>
							<div className='message-text'>
								<div className='typing-indicator'>
									<div className='dot' />
									<div className='dot' />
									<div className='dot' />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className='chat-disclaimer'>
				<span>Cuộc hội thoại này không được lưu lại. Các thông tin chỉ mang tính chất tham khảo!</span>
			</div>
		</div>
	);
};

export default ContentBoxChat;
