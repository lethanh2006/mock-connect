import {
	createThreadChatBot,
	createUserChatBot,
	deleteThread,
	getChiTietThread,
	getThreadUser,
	getUserChatBot,
	postChatBot,
	updateTitleThread,
} from '@/services/TienIch/ChatbotV2';
import { type ChatbotAmiV2 } from '@/services/TienIch/ChatbotV2/typing';
import { sanitizeObject } from '@/utils/utils';
import { nanoid } from 'nanoid';
import { useState } from 'react';

export default () => {
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingThreads, setLoadingThreads] = useState(false);
	const [loadingMessages, setLoadingMessages] = useState(false);

	const [danhSach, setDanhSach] = useState<ChatbotAmiV2.IRecord[]>([]);
	const [boxChatVisible, setBoxChatVisible] = useState(false);
	const [videoRefs, setVideoRefs] = useState<Record<string, any>>({});
	const [playedVideos, setPlayedVideos] = useState<Set<string>>(new Set());
	const [formSubmitingUser, setFormSubmitingUser] = useState(false);
	const [formSubmitingThread, setFormSubmitingThread] = useState(false);

	const [recordUser, setRecordUser] = useState<ChatbotAmiV2.IUser>();
	const [threadId, setThreadId] = useState<number | null>(null);
	const [dsThread, setDSThread] = useState<ChatbotAmiV2.IThread[]>([]);

	const convertMarkdown = (text: string) => {
		const updatedText = text
			.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
			.replace(/\*(.*?)\*/g, '<i>$1</i>')
			.replace(/\\n/g, '<br/>');
		return sanitizeObject(updatedText);
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

	const createThreadChatBotModel = async (payLoad: ChatbotAmiV2.IThread, getData?: () => void) => {
		if (formSubmitingThread) return Promise.reject('form submiting');
		setFormSubmitingThread(true);
		try {
			const res = await createThreadChatBot(payLoad);

			if (getData) getData();
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
			{
				_id: nanoid(),
				content: message,
				isUser: true,
				createdAt: new Date().toISOString(),
			} as ChatbotAmiV2.IRecord,
		]);

		preAction?.();

		try {
			const res = await postChatBot(user_id, thread_id, message);

			const content = res.data?.response ?? 'Không có kết quả';

			const recommendQuestions: string[] = res.data?.recommend_questions ?? [];
			const sources: ChatbotAmiV2.ISourceItem[] = res.data?.sources ?? [];

			setDanhSach((prev) => [
				...prev,
				{
					_id: nanoid(),
					content: convertMarkdown(content),
					isUser: false,
					createdAt: new Date().toISOString(),
					recommendQuestions,
					sources,
				} as ChatbotAmiV2.IRecord,
			]);

			return content;
		} catch (error) {
			console.error('Lỗi khi gửi tin nhắn chatbot:', error);
			throw error;
		} finally {
			setFormSubmiting(false);
		}
	};

	const getThreadUserModel = async (user_id: number) => {
		setLoadingThreads(true);
		try {
			const res = await getThreadUser(user_id);
			setDSThread(res?.data);
			return res?.data;
		} finally {
			setLoadingThreads(false);
		}
	};

	const getChiTietThreadModel = async (thread_id: number) => {
		setLoadingMessages(true);
		try {
			const res = await getChiTietThread(thread_id);
			setDanhSach(
				(res?.data?.chat_history || []).map((item: any) => ({
					...item,
					isUser: item?.sender === 'user',
					recommendQuestions: item?.meta_info?.recommendations,
					sources: item?.meta_info?.sources,
				})),
			);

			return res?.data?.chat_history;
		} finally {
			setLoadingMessages(false);
		}
	};

	const updateTitleThreadModel = async (payLoad: ChatbotAmiV2.IThread, getData: () => void) => {
		setLoadingThreads(true);
		try {
			const res = await updateTitleThread(payLoad);

			if (getData) getData();
			return res?.data;
		} finally {
			setLoadingThreads(false);
		}
	};

	const deleteThreadModel = async (thread_id: number, getData: () => void) => {
		setLoadingThreads(true);
		try {
			const res = await deleteThread(thread_id);

			if (getData) getData();
			return res?.data;
		} finally {
			setLoadingThreads(false);
		}
	};

	return {
		loading,
		loadingThreads,
		loadingMessages,
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
		threadId,
		setThreadId,
		getThreadUserModel,
		dsThread,
		getChiTietThreadModel,
		updateTitleThreadModel,
		deleteThreadModel,
	};
};
