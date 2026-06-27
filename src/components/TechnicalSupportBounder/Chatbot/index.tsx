import ButtonExtend from '@/components/Table/ButtonExtend';
import { defaultVoiceMessages } from '@/services/TienIch/Chatbot/constant';
import { getPublicAssetPath } from '@/utils/path';
import { RightOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ContentBoxChat from './Content';
import './style.less';
import TextboxChatbot from './Textbox';

const ChatbotOverlay = () => {
	const { danhSach, setDanhSach, boxChatVisible, setBoxChatVisible } = useModel('tienich.chatbot');

	useEffect(() => {
		if (boxChatVisible && !danhSach.length)
			setDanhSach([
				{
					_id: nanoid(),
					content: 'Xin chào, mình là Ami, mình có thể giúp gì cho bạn?',
					urlVideo: defaultVoiceMessages[Math.floor(Math.random() * defaultVoiceMessages.length)],
					createdAt: new Date().toISOString(),
					isUser: false,
				},
			]);
	}, [boxChatVisible]);

	return (
		<>
			{boxChatVisible ? (
				<Card
					className='card-highlight card-chatbot'
					size='small'
					title='Giải đáp thắc mắc cùng Ami'
					extra={
						<ButtonExtend
							tooltip='Ẩn hộp thoại'
							icon={<RightOutlined />}
							onClick={() => setBoxChatVisible(false)}
							type='link'
						/>
					}
				>
					<div className='content'>
						<ContentBoxChat />

						<TextboxChatbot />
					</div>
				</Card>
			) : (
				<div className='chatbot-button'>
					<div className='title-huong-dan'>
						<i>Giải đáp thắc mắc cùng Ami</i>
					</div>

					<div className='pulse' onClick={() => setBoxChatVisible(true)}>
						<img src={getPublicAssetPath('images/chatbot.png')} alt='chatbot' />
					</div>
				</div>
			)}
		</>
	);
};

export default ChatbotOverlay;
