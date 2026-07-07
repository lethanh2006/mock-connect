import dayjs from '@/utils/dayjs';
import { getPublicAssetPath } from '@/utils/path';
import { sanitizeObject } from '@/utils/utils';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Link, useModel } from 'umi';

const ContentBoxChat = () => {
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { danhSach, formSubmiting, genVideoMessageModel, videoRefs, setVideoRefs, playedVideos, setPlayedVideos } =
		useModel('tienich.chatbot');
	const lastNameChar = recSinhVien?.ten?.split(' ')?.at(-1)?.[0];

	useEffect(() => {
		// Tạo mới các refs cho video
		if (!formSubmiting) {
			danhSach
				.filter((i) => !!i.urlVideo)
				.forEach((i) => {
					setVideoRefs((refs) => {
						if (!refs?.[i._id]) refs[i._id] = React.createRef();
						return refs;
					});
				});
		}
	}, [formSubmiting]);

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
						icon={!recSinhVien?.anhDaiDienUrl ? (lastNameChar ?? <UserOutlined />) : undefined}
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
					<Avatar src={getPublicAssetPath('images/chatbot_ava.png')} />
				</div>

				<div className='content-text'>
					{message.content ? (
						<div className='text' dangerouslySetInnerHTML={{ __html: sanitizeObject(message.content) }} />
					) : null}

					{message.urlVideo ? (
						<video
							id={message._id}
							width='256'
							height='256'
							controls
							controlsList='nodownload nofullscreen noremoteplayback'
							autoPlay={!playedVideos.has(message._id)}
							ref={videoRefs?.[message._id]}
							onPlay={(e) => {
								// Khi play thì pause các video khác lại
								Object.keys(videoRefs).map((id) => {
									if (id !== message._id) videoRefs[id]?.current?.pause();
								});
								setPlayedVideos((i) => i.add(message._id));
							}}
						>
							<source src={message.urlVideo} type='video/mp4' />
							{message.urlVideo}
						</video>
					) : !!message.content ? (
						<Link
							to='#!'
							onClick={(e) => {
								e.preventDefault();
								genVideoMessageModel(message).catch(console.log);
							}}
						>
							Video <PlayCircleOutlined />
						</Link>
					) : null}
				</div>
			</>
		);
	};

	return (
		<div className='messages'>
			<span className='note'>Cuộc hội thoại này không được lưu lại. Các thông tin chỉ mang tính chất tham khảo!</span>

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
						<Avatar src={getPublicAssetPath('images/chatbot_ava.png')} />
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

export default ContentBoxChat;
