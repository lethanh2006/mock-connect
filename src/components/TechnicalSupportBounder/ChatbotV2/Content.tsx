import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ContentBoxChatV2 = () => {
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach, formSubmiting } = useModel('tienich.chatbotv2');
	const lastNameChar = recSinhVien?.ten?.split(' ')?.at(-1)?.[0];

	useEffect(() => {
		const latestId = danhSach.at(-1)?._id;
		if (!!latestId) {
			const element = document.getElementById(latestId);
			element?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [danhSach.length]);

	const MyMessage = (props: { message: ChatbotAmi.IRecord }) => {
		const { message } = props;
		return (
			<>
				<div className='text'>{message.content}</div>
				<div className='avatar'>
					<Avatar
						src={recSinhVien?.anhDaiDienUrl ? <img alt='avatar' src={recSinhVien?.anhDaiDienUrl} /> : undefined}
						icon={!recSinhVien?.anhDaiDienUrl ? lastNameChar ?? <UserOutlined /> : undefined}
						alt='avatar'
					/>
				</div>
			</>
		);
	};

	const BotMessage = (props: { message: ChatbotAmi.IRecord }) => {
		const { message } = props;
		return (
			<>
				<div className='avatar'>
					<Avatar src='/images/chatbot_ava.png' />
				</div>

				<div className='content-text'>
					{message.content ? <div className='text' dangerouslySetInnerHTML={{ __html: message.content }} /> : null}
				</div>
			</>
		);
	};

	return (
		<div className='messages'>
			{/* <span className='note'>Cuộc hội thoại này không được lưu lại. Các thông tin chỉ mang tính chất tham khảo!</span> */}

			{danhSach.map((item) => (
				<div
					className={classNames({ message: true, bot: !item.isUser })}
					key={item._id}
					id={item._id}
					title={moment(item.createdAt).fromNow()}
				>
					{item.isUser ? <MyMessage message={item} /> : <BotMessage message={item} />}
				</div>
			))}

			{formSubmiting ? (
				<div className='message bot' id='tidot_loading'>
					<div className='avatar'>
						<Avatar src='/images/chatbot_ava.png' />
					</div>
					<div className='text'>
						<div className='ticontainer'>
							<div className='tiblock'>
								<div className='tidot' />
								<div className='tidot' />
								<div className='tidot' />
							</div>
						</div>
					</div>
				</div>
			) : null}

			{/* Fake to scroll to end */}
			<div id='end_message' />
		</div>
	);
};

export default ContentBoxChatV2;
