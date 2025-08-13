import { postChatMessage, postVoiceMessage } from '@/services/TienIch/Chatbot';
import { nanoid } from 'nanoid';
import { useState } from 'react';

export default () => {
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [danhSach, setDanhSach] = useState<ChatbotAmi.IRecord[]>([]);
	const [boxChatVisible, setBoxChatVisible] = useState(false);
	const [videoRefs, setVideoRefs] = useState<Record<string, any>>({});
	const [playedVideos, setPlayedVideos] = useState<Set<string>>(new Set());

	const convertMarkdown = (text: string) => {
		const updatedText = text
			.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
			.replace(/\*(.*?)\*/g, '<i>$1</i>')
			.replace(/\\n/g, '<br/>');
		return updatedText;
	};

	const genVideoMessageModel = async (record: ChatbotAmi.IRecord): Promise<ChatbotAmi.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res1 = await postVoiceMessage(record.content, record._id);
			const urlVideo = res1.data?.url_video;
			setDanhSach((prev) => [...prev].map((i) => (i._id === record._id ? { ...i, urlVideo } : i)));
			return { ...record, urlVideo };
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const postChatMessageModel = async (question: string, preAction?: () => void): Promise<string> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		setDanhSach((prev) => [
			...prev,
			{ _id: nanoid(), content: question, isUser: true, createdAt: new Date().toISOString() },
		]);
		if (preAction) preAction();

		try {
			const res = await postChatMessage(question);
			const content = res.data?.text ?? 'Không có kết quả';
			const message = {
				_id: nanoid(),
				content: convertMarkdown(content),
				isUser: false,
				createdAt: new Date().toISOString(),
			};
			setDanhSach((prev) => [...prev, message]);

			return content;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		formSubmiting,
		setFormSubmiting,
		danhSach,
		setDanhSach,
		postChatMessageModel,
		boxChatVisible,
		setBoxChatVisible,
		genVideoMessageModel,
		videoRefs,
		setVideoRefs,
		playedVideos,
		setPlayedVideos,
	};
};
