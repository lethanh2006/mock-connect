import { createThreadChatBot, createUserChatBot, getUserChatBot, postChatBot } from '@/services/TienIch/ChatbotV2';
import { type ChatbotAmiV2 } from '@/services/TienIch/ChatbotV2/typing';
import { nanoid } from 'nanoid';
import { useState } from 'react';

export default () => {
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [loading, setLoading] = useState(false);
	const [danhSach, setDanhSach] = useState<ChatbotAmiV2.IRecord[]>([]);
	const [boxChatVisible, setBoxChatVisible] = useState(false);
	const [videoRefs, setVideoRefs] = useState<Record<string, any>>({});
	const [playedVideos, setPlayedVideos] = useState<Set<string>>(new Set());
	const [formSubmitingUser, setFormSubmitingUser] = useState(false);
	const [formSubmitingThread, setFormSubmitingThread] = useState(false);

	const [recordUser, setRecordUser] = useState<ChatbotAmiV2.IUser>();

	const convertMarkdown = (text: string) => {
		const updatedText = text
			.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
			.replace(/\*(.*?)\*/g, '<i>$1</i>')
			.replace(/\\n/g, '<br/>');
		return updatedText;
	};

	const getUserChatBotModel = async (ssoId: string) => {
		if (loading) return Promise.reject('form submiting');
		setLoading(true);
		try {
			const res = await getUserChatBot(ssoId);
			setRecordUser(res?.data?.data);
			return res?.data?.data;
		} finally {
			setLoading(false);
		}
	};

	const createUserChatBotModel = async (payLoad: ChatbotAmiV2.IUser) => {
		if (formSubmitingUser) return Promise.reject('form submiting');
		setFormSubmitingUser(true);
		try {
			const res = await createUserChatBot(payLoad);
			setRecordUser(res?.data?.data);
			return res?.data?.data;
		} finally {
			setFormSubmitingUser(false);
		}
	};

	const createThreadChatBotModel = async (payLoad: ChatbotAmiV2.IThread) => {
		if (formSubmitingThread) return Promise.reject('form submiting');
		setFormSubmitingThread(true);
		try {
			const res = await createThreadChatBot(payLoad);
			return res?.data;
		} finally {
			setFormSubmitingThread(false);
		}
	};

	const postChatBotModel = async (
		{ user_id, thread_id, message }: { user_id: number; thread_id: number; message: string },
		preAction?: () => void,
	) => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		setDanhSach((prev) => [
			...prev,
			{ _id: nanoid(), content: message, isUser: true, createdAt: new Date().toISOString() },
		]);
		preAction?.();

		try {
			const res = await postChatBot(user_id, thread_id, message);
			const content = res.data?.response ?? 'Không có kết quả';
			setDanhSach((prev) => [
				...prev,
				{ _id: nanoid(), content: convertMarkdown(content), isUser: false, createdAt: new Date().toISOString() },
			]);
			return content;
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		loading,
		formSubmitingUser,
		formSubmitingThread,
		formSubmiting,
		setFormSubmiting,
		danhSach,
		setDanhSach,
		boxChatVisible,
		setBoxChatVisible,
		videoRefs,
		setVideoRefs,
		playedVideos,
		setPlayedVideos,
		recordUser,
		createUserChatBotModel,
		createThreadChatBotModel,
		postChatBotModel,
		getUserChatBotModel,
	};
};
