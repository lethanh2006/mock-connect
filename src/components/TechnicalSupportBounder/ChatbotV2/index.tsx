import ButtonExtend from '@/components/Table/ButtonExtend';
import { getPublicAssetPath } from '@/utils/path';
import { toCamelCase } from '@/utils/utils';
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
		loading,
	} = useModel('tienich.chatbotv2');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { initialState } = useModel('@@initialState');

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: (initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || ''));

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
		}

		if (boxChatVisible && !recordUser?.id) {
			createUserChatBotModel({
				username: fullName ?? 'admin',
				email:
					recSinhVien?.email ??
					`${toCamelCase(fullName ?? 'admin')}@${APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH.toLowerCase()}.edu.vn`,
				sso_sub: recSinhVien?.ssoId ?? initialState?.currentUser?.ssoId ?? 'admin_ssoId',
			} as any);
		}
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
						<img src={getPublicAssetPath('images/chatbot.png')} alt='chatbot' />
					</div>
				</div>
			)}
		</>
	);
};

export default ChatbotOverlayV2;
