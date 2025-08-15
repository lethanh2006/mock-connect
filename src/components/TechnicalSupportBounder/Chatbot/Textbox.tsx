import { resetFieldsForm } from '@/utils/utils';
import { Form, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const TextboxChatbot = () => {
	const { postChatMessageModel, formSubmiting } = useModel('tienich.chatbot');
	const [form] = Form.useForm();
	const [showCommentEdit, setShowCommendEdit] = useState<boolean>(false);

	const onFinish = (values: any) => {
		if (!values.question) return;
		resetFieldsForm(form);

		postChatMessageModel(values.question, () => {
			const element = document.getElementById('end_message');
			element?.scrollIntoView({ behavior: 'smooth' });
		})
			.then(() => {
				setShowCommendEdit(false);
			})
			.catch(console.log);
	};

	return (
		<div className='textbox'>
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

export default TextboxChatbot;
