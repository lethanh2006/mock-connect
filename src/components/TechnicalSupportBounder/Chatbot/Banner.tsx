import { useModel } from 'umi';
import './style.less';

const ChatbotBanner = () => {
	const { setBoxChatVisible } = useModel('tienich.chatbot');

	return (
		<div className='chatbot-banner' onClick={() => setBoxChatVisible(true)}>
			<img src='/student/images/chatbot_banner.png' alt='banner' />
		</div>
	);
};

export default ChatbotBanner;
