import type { ChatbotAmiV2 } from '@/services/TienIch/ChatbotV2/typing';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useModel } from 'umi';

import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Collapse } from 'antd';
import ReactMarkdown from 'react-markdown';

const { Panel } = Collapse;

const ContentBoxChatV2 = () => {
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach, formSubmiting, postChatBotModel, recordUser, threadId } = useModel('tienich.chatbotv2');
	const { initialState } = useModel('@@initialState');

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || '');
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	useEffect(() => {
		const latestId = danhSach.at(-1)?._id;
		if (!!latestId) {
			const element = document.getElementById(latestId);
			element?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [danhSach.length]);

	const MyMessage = (props: { message: ChatbotAmiV2.IRecord }) => {
		const { message } = props;
		return (
			<>
				<div className='text'>{message.content}</div>
				<div className='avatar'>
					<Avatar
						src={recSinhVien?.anhDaiDienUrl ? <img alt='avatar' src={recSinhVien?.anhDaiDienUrl} /> : undefined}
						icon={!recSinhVien?.anhDaiDienUrl ? (lastNameChar ?? <UserOutlined />) : undefined}
						alt='avatar'
					/>
				</div>
			</>
		);
	};

	const BotMessage = (props: { message: ChatbotAmiV2.IRecord }) => {
		const { message } = props;
		return (
			<>
				<div className='avatar'>
					<Avatar src='/images/chatbot_ava.png' />
				</div>

				<div className='content-text'>
					{message.content ? <div className='text' dangerouslySetInnerHTML={{ __html: message.content }} /> : null}

					{(message?.recommendQuestions?.length ?? 0) > 0 && (
						<div className='quick-replies'>
							{message?.recommendQuestions?.map((q, idx) => (
								<button
									// eslint-disable-next-line react/no-array-index-key
									key={idx}
									className='quick-reply-btn'
									onClick={() =>
										postChatBotModel({
											message: q,
											user_id: recordUser?.id ?? 0,
											thread_id: threadId ?? 0,
										})
									}
								>
									{q}
								</button>
							))}
						</div>
					)}

					{message.sources?.length ? (
						<Collapse ghost>
							<Panel header='Nguồn tham khảo' key='1'>
								<div className='sources'>
									<ReactMarkdown
										components={{
											li: ({ children }) => <li>{children}</li>,
											p: ({ children }) => <p>{children}</p>,
											// eslint-disable-next-line @typescript-eslint/no-shadow
											a: ({ node, ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />,
											// eslint-disable-next-line @typescript-eslint/no-shadow
											img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />,
										}}
									>
										{message.sources
											.map((src) => {
												const soQD = src.source?.['Số QĐ'] ?? '';
												const ngayBanHanh = src.source?.['Ngày ban hành']
													? formatDate(src.source['Ngày ban hành'])
													: '';
												const header1 = src.source?.['Header 1'] ?? '';
												const header2 = src.source?.['Header 2'] ?? '';
												const content = src.content || '';

												const headerLine = `**${soQD}**${ngayBanHanh ? ` (${ngayBanHanh})` : ''}`;
												const titleLine = `${header1}${header2 ? ` - ${header2}` : ''}`;
												return `${headerLine} ${titleLine} ${content}`;
											})
											.join('\n\n---\n\n')}
									</ReactMarkdown>
								</div>
							</Panel>
						</Collapse>
					) : null}
				</div>
			</>
		);
	};

	return (
		<div className='messages'>
			{danhSach.map((item) => (
				<div
					className={classNames({ message: true, bot: !item.isUser })}
					key={item._id}
					id={item._id}
					title={dayjs(item.createdAt).fromNow()}
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

			{/* Fake để scroll xuống cuối */}
			<div id='end_message' />
		</div>
	);
};

export default ContentBoxChatV2;
