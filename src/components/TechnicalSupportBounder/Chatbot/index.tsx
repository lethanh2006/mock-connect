import ButtonExtend from '@/components/Table/ButtonExtend';
import { defaultVoiceMessages } from '@/services/TienIch/Chatbot/constant';
import { RightOutlined } from '@ant-design/icons';
import { Card, Spin } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ContentBoxChat from './Content';
import './style.less';
import TextboxChatbot from './Textbox';

const ChatbotOverlay = () => {
	const {
		danhSach,
		setDanhSach,
		boxChatVisible,
		setBoxChatVisible,
		createUserChatBotModel,
		recordUser,
		formSubmitingUser,
	} = useModel('tienich.chatbot');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (!boxChatVisible || danhSach.length) return;

		setDanhSach([
			{
				_id: nanoid(),
				content: 'Xin chào, mình là Ami, mình có thể giúp gì cho bạn?',
				urlVideo: defaultVoiceMessages[Math.floor(Math.random() * defaultVoiceMessages.length)],
				createdAt: new Date().toISOString(),
				isUser: false,
			},
		]);

		if (!recordUser?.id) {
			const randomSuffix = nanoid(5);
			const baseName = recSinhVien?.ten?.replace(/\s+/g, '') || 'user';
			const baseEmailName = recSinhVien?.email?.split('@')[0] || 'user';
			createUserChatBotModel({
				password: 'abc@1234',
				username: `${baseName}_${randomSuffix}`,
				email: `${baseEmailName}_${randomSuffix}@${recSinhVien?.email?.split('@')[1] || 'example.com'}`,
			} as any);
		}
	}, [boxChatVisible]);

	return boxChatVisible ? (
		<Card
			className='card-highlight card-chatbot'
			size='small'
			title={
				<div className='chatbot-header'>
					<div className='chatbot-title'>
						<span className='chatbot-name'>Giải đáp thắc mắc cùng Ami</span>
						<span className='chatbot-status'>Online</span>
					</div>
				</div>
			}
			extra={
				<ButtonExtend
					icon={<RightOutlined />}
					onClick={() => setBoxChatVisible(false)}
					type='text'
					className='minimize-btn'
					tooltip='Ẩn hộp thoại'
				/>
			}
		>
			<div className='content'>
				<Spin spinning={formSubmitingUser} tip='Loading...'>
					<ContentBoxChat />
					<TextboxChatbot />
				</Spin>
			</div>
		</Card>
	) : (
		<div className='chatbot-button'>
			<div className='title-huong-dan'>
				<i>Giải đáp thắc mắc cùng Ami</i>
			</div>
			<div className='pulse' onClick={() => setBoxChatVisible(true)}>
				<img src='/images/chatbot.png' alt='chatbot' />
			</div>
		</div>
	);
};

export default ChatbotOverlay;
