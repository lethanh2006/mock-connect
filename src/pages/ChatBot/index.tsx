import { quickReplies } from '@/services/TienIch/ChatbotV2/constant';
import type { ChatbotAmiV2 } from '@/services/TienIch/ChatbotV2/typing';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { resetFieldsForm, toCamelCase } from '@/utils/utils';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Collapse, Form, Input, Spin } from 'antd';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';
import TheardsPage from './components/Theards';
import './style.less';

const { Panel } = Collapse;

const ChatBotPage = () => {
	const [form] = Form.useForm();
	const { initialState } = useModel('@@initialState');
	const {
		createUserChatBotModel,
		danhSach,
		formSubmiting,
		recordUser,
		getThreadUserModel,
		threadId,
		setThreadId,
		loadingMessages,
		postChatBotModel,
		setDanhSach,
		createThreadChatBotModel,
	} = useModel('tienich.chatbotv2');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: (initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || ''));
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	useEffect(() => {
		createUserChatBotModel({
			password: 'abc@1234',
			username: fullName ?? 'admin',
			email:
				recSinhVien?.email ??
				`${toCamelCase(fullName ?? 'admin')}@${APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH.toLowerCase()}.edu.vn`,
			sso_sub: recSinhVien?.ssoId ?? initialState?.currentUser?.ssoId ?? 'admin_ssoId',
		} as any);
	}, []);

	useEffect(() => {
		if (recordUser?.id) {
			getThreadUserModel(recordUser.id)
				.then()
				.catch((err) => console.log(err));
		}
	}, [recordUser?.id]);

	useEffect(() => {
		if (!threadId) {
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
	}, [threadId]);

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const onFinish = async ({ question }: { question: string }) => {
		if (!question) return;
		resetFieldsForm(form);

		try {
			let currentThreadId = threadId;
			if (!currentThreadId && recordUser?.id) {
				const threadRes = await createThreadChatBotModel({ user_id: recordUser.id, title: question } as any, () =>
					getThreadUserModel(recordUser.id),
				);
				currentThreadId = threadRes?.id;
				setThreadId(currentThreadId);
			}

			if (recordUser?.id && currentThreadId) {
				await postChatBotModel({ user_id: recordUser.id, thread_id: currentThreadId, message: question });
			}
		} catch (err) {
			console.error('Lỗi gửi tin nhắn:', err);
		}
	};

	const MyMessage = (props: { message: ChatbotAmiV2.IRecord }) => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
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
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const { message } = props;
		return (
			<>
				<div className='avatar'>
					<Avatar src='/student/images/chatbot_ava.png' />
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
		<Card bodyStyle={{ padding: 0, height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='15%'>
					<TheardsPage form={form} />
				</Pane>

				<Pane minSize='40%'>
					<Card
						bordered={false}
						style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
						bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
					>
						<div
							style={{
								flex: 1,
								overflowY: 'auto',
								padding: '24px',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Spin spinning={loadingMessages} style={{ flex: 1 }}>
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
												<Avatar src='/student/images/chatbot_ava.png' />
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

									<div id='end_message' />
								</div>
							</Spin>
						</div>

						<div>
							{danhSach?.length === 1 ? (
								<div className='quick-replies'>
									{quickReplies.map((q) => (
										<button key={q} className='quick-reply-btn' onClick={() => onFinish({ question: q })}>
											{q}
										</button>
									))}
								</div>
							) : null}
							<Form form={form} onFinish={onFinish} disabled={formSubmiting}>
								<div className='input-area'>
									<Form.Item name='question' noStyle style={{ flex: 1 }}>
										<Input autoFocus placeholder='Nhập câu hỏi...' />
									</Form.Item>

									<Button type='link' htmlType='submit' icon={<SendOutlined />} loading={formSubmiting} />
								</div>

								<div className='note'>Amin có thể mắc lỗi. Hãy cân nhắc kiểm tra thông tin quan trọng.</div>
							</Form>
						</div>
					</Card>
				</Pane>
			</SplitPane>
		</Card>
	);
};

export default ChatBotPage;
