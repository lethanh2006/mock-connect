import { resetFieldsForm } from '@/utils/utils';
import { Empty, Form, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const quickReplies = [
	'Hướng dẫn đăng ký học phần',
	'Thông tin học phí và lịch thanh toán',
	'Liên hệ phòng đào tạo',
	'Lịch học và lịch thi',
];

const TextboxChatbotV2 = () => {
	const { postChatBotModel, formSubmiting, createThreadChatBotModel, recordUser, danhSach, threadId, setThreadId } =
		useModel('tienich.chatbotv2');
	const [form] = Form.useForm();
	const [showCommentEdit, setShowCommendEdit] = useState<boolean>(false);

	const onFinish = async ({ question }: { question: string }) => {
		if (!question) return;
		resetFieldsForm(form);

		try {
			let currentThreadId = threadId;
			if (!currentThreadId && recordUser?.id) {
				const threadRes = await createThreadChatBotModel({ user_id: recordUser.id, title: question } as any);
				currentThreadId = threadRes?.id;
				setThreadId(currentThreadId);
			}

			if (recordUser?.id && currentThreadId) {
				await postChatBotModel({ user_id: recordUser.id, thread_id: currentThreadId, message: question });
			}
			setShowCommendEdit(false);
		} catch (err) {
			console.error('Lỗi gửi tin nhắn:', err);
		}
	};

	if (!recordUser?.id) {
		return (
			<div className='textbox'>
				<Empty
					description='Không tìm thấy thông tin người dùng. Vui lòng quay lại sau để sử dụng Ami!'
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			</div>
		);
	}

	return (
		<div className='textbox'>
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
				{showCommentEdit ? (
					<Form.Item name='question' noStyle>
						<Input
							autoFocus
							placeholder='Nhập câu hỏi...'
							onBlur={(e) => {
								if (!e.target.value) setShowCommendEdit(false);
							}}
						/>
					</Form.Item>
				) : (
					<div className='fake-input' onClick={() => setShowCommendEdit(true)}>
						Bạn muốn hỏi gì?
					</div>
				)}

				<svg
					onClick={() => form.submit()}
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					style={{
						width: 24,
						height: 24,
						marginLeft: 12,
						color: 'var(--primary-color)',
						flexShrink: 0,
						cursor: 'pointer',
					}}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
					/>
				</svg>
			</Form>
		</div>
	);
};

export default TextboxChatbotV2;
