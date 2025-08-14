import ButtonExtend from '@/components/Table/ButtonExtend';
import { RightOutlined } from '@ant-design/icons';
import { Card, Spin } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ContentBoxChatV2 from './Content';
import './style.less';
import TextboxChatbotV2 from './Textbox';

const ChatbotOverlayV2 = () => {
	const {
		danhSach,
		setDanhSach,
		boxChatVisible,
		setBoxChatVisible,
		createUserChatBotModel,
		recordUser,
		formSubmitingUser,
		// getUserChatBotModel,
		loading,
	} = useModel('tienich.chatbotv2');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (boxChatVisible && !danhSach.length) {
			setDanhSach([
				{
					_id: nanoid(),
					content: 'Xin chào, mình là Ami, mình có thể giúp gì cho bạn?',
					urlVideo: '',
					createdAt: new Date().toISOString(),
					isUser: false,
				},
			]);

			if (recSinhVien?.ssoId && !recordUser?.id) {
				// getUserChatBotModel(recSinhVien.ssoId);
				createUserChatBotModel({
					password: 'abc@1234',
					username: recSinhVien.ten,
					email: recSinhVien.email,
					sso_sub: recSinhVien.ssoId,
				} as any);
			}
		}
	}, [boxChatVisible]);

	// useEffect(() => {
	// 	if (boxChatVisible && recSinhVien?.ssoId && !recordUser?.id) {
	// 		createUserChatBotModel({
	// 			password: 'abc@1234',
	// 			username: recSinhVien.ten,
	// 			email: recSinhVien.email,
	// 			sso_sub: recSinhVien.ssoId,
	// 		} as any);
	// 	}
	// }, [recordUser?.id]);

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
					<Spin spinning={formSubmitingUser || loading}>
						<div className='content'>
							<ContentBoxChatV2 />

							<TextboxChatbotV2 />
						</div>
					</Spin>
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
			)}
		</>
	);
};

export default ChatbotOverlayV2;
