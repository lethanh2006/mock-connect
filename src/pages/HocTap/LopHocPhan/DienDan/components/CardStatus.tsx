import styled from 'styled-components';
import { CheckCircleOutlined, CopyOutlined, DeleteOutlined, EditOutlined, PushpinOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import ExpandText from '@/components/ExpandText';
import { message, Popconfirm, Popover, Tooltip } from 'antd';
import { history } from 'umi';
import { copyToClipboard } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import _ from 'lodash';
import AvatarBlog from './Avatar';
import BoxFile from './BoxFile';
import Comment from "@/pages/HocTap/LopHocPhan/DienDan/components/Comment";

const CardStatusWrapper = styled.div`
	.card {
		width: 100%;
		max-width: 800px;
		border-radius: 2px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 1px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
	}
	.header-card {
		//padding: 10px 20px 0px 20px;

		.user-name {
			.image {
				//width: 42px;
				//height: 42px;
				margin-right: 8px;
				//overflow: hidden;
				border-radius: 50%;
			}

			.name {
				color: rgb(0, 0, 0);
				font-weight: 600;
				font-size: 16px;
			}

			.time {
				color: #000000b3;
				font-size: 12px;
			}
		}
	}

	.content {
		margin-top: 12px;
		padding: 0px 20px 0px 20px;
	}

	.action-info {
		margin-top: 6px;
		padding: 0px 20px 0px 20px;

		.like {
			font-size: 0.9375rem;
		}

		.sum-comment {
			font-size: 0.9375rem;
		}
	}

	.action {
		margin-top: 12px;
		padding: 8px 20px 8px 20px;
		border-top: 1px solid rgba(167, 171, 175, 0.53);
		border-bottom: 1px solid rgba(167, 171, 175, 0.53);
	}

	.comment-content {
		padding: 0px 20px 20px 20px;
	}

	.option-them {
		padding: 12px;
		background: #ffffff;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
	}

	.option-item {
		margin-bottom: 8px;
		cursor: pointer;
		&:hover {
			color: #0065ca;
		}
		&:last-of-type {
			margin-bottom: 0;
		}
	}
`;

interface IProps {
	handleDoubleClick?: () => void;
	data: BaiDang.IRecord;
	deleteModel: (id: string) => void;
	handleEdit: (data: BaiDang.IRecord) => void;
	handlePin: (pin: boolean) => void;
	detail?: boolean;
}

const CardStatus = (props: IProps) => {
	const { data, deleteModel, handleEdit, handlePin, detail } = props;
	const cardRef = useRef(null);
	const commentRef = useRef(null);
	const { record: recNhanSu } = useModel('sinhvien.sinhvien');

	const handleClickOutSide = (e: any) => {
		const node = cardRef?.current;
		const { target } = e;
		if (node) {
			//@ts-ignore
			if (!node?.contains(target)) {
				if (commentRef?.current) {
					//@ts-ignore
					commentRef?.current?.setShowCommend(false);
				}
			}
		}
	};

	useEffect(() => {
		window.addEventListener('click', handleClickOutSide);
		return () => {
			window.removeEventListener('click', handleClickOutSide);
		};
	}, []);

	return (
		<CardStatusWrapper>
			<div
				className='card relative'
				onDoubleClick={() => {
					history.push(`${history?.location?.pathname}?idBaiViet=${data?._id}${history?.location?.hash}`);
				}}
			>
				<div
					className='header-card flex justify-between'
					style={{ padding: data?.ghimBaiViet ? ' 20px 20px 0px 20px' : ' 20px 20px 0px 20px' }}
				>
					<div className='user-name flex item-center'>
						<div className='image'>
							<AvatarBlog url={data?.thongTinNguoiDang?.avatar} style={{ width: 42, height: 42 }} />
						</div>
						<div className='thong-tin'>
							<div className='flex item-center'>
								<div className='name'>{data?.thongTinNguoiDang?.hoTen}</div>
								{data?.thongTinNguoiDang?.isGiaoVien && (
									<CheckCircleOutlined style={{ color: 'green', marginLeft: 6, marginRight: 6 }} />
								)}
								{/*{data?.ghimBaiViet && (*/}
								{/*	<div className='' style={{ right: '20px', top: '4px' }}>*/}
								{/*		<PushpinOutlined style={{ color: '#1890ff' }} />*/}
								{/*	</div>*/}
								{/*)}*/}
							</div>
							<div className='time'>
								{data?.ngayDang ? moment(data?.ngayDang).calendar() : moment(data?.createdAt).calendar()}
							</div>
						</div>
					</div>
					<div className='flex item-center'>
						{data?.ghimBaiViet && (
							<div className='' style={{ fontSize: 16, marginRight: 12, transform: 'rotate(-45deg)' }}>
								<PushpinOutlined style={{ color: '#1890ff' }} />
							</div>
						)}
						{data?.thongTinNguoiDang?.ssoId === recNhanSu?.ssoId && (
							<>
								<Popover
									className='popover-post'
									content={
										<>
											<div
												className='option-item'
												style={{ marginBottom: 8, cursor: 'pointer' }}
												onClick={() => {
													handleEdit(data);
												}}
											>
												<EditOutlined /> Chỉnh sửa bài viết
											</div>
											<div
												className='option-item'
												style={{ marginBottom: 8, cursor: 'pointer' }}
												onClick={() => {
													const string = window.location.href?.split('#');
													copyToClipboard(`${string?.[0]}?idBaiViet=${data?._id}${history?.location?.hash}`, () => {
														message.success('Sao chép thành công');
													});
												}}
											>
												<CopyOutlined /> Sao chép liên kết
											</div>
											<div
												className='option-item'
												style={{ marginBottom: 8, cursor: 'pointer' }}
												onClick={() => {
													handlePin(!data?.ghimBaiViet);
												}}
											>
												<PushpinOutlined /> {data?.ghimBaiViet ? 'Bỏ ghim' : 'Ghim'}
											</div>
											<Popconfirm
												title={'Bạn có chắc chắn muốn xoá bài viết này?'}
												onConfirm={() => {
													deleteModel(data?._id);
												}}
											>
												<div
													className='option-item'
													style={{ cursor: 'pointer' }}
													// onClick={() => {
													//   deleteModel(data?._id);
													// }}
												>
													<DeleteOutlined /> Xoá bài viết
												</div>
											</Popconfirm>
										</>
									}
									placement={'right'}
								>
									<div
										className='action-menu pointer'
										// onClick={() => {
										//   setShowOption(true);
										// }}
									>
										<img src='/images/menu.svg' alt='icon' />
									</div>
								</Popover>
							</>
						)}
					</div>
				</div>
				<div className='content'>
					<b dangerouslySetInnerHTML={{ __html: data?.tieuDe ?? '' }}></b>
					<ExpandText ellipsis={{ rows: 7 }}>
						<div dangerouslySetInnerHTML={{ __html: data?.noiDung ?? '' }}></div>
					</ExpandText>
					{typeof data?.fileDinhKem === 'string' ? (
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
							<BoxFile url={data?.fileDinhKem} />
						</div>
					) : (
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
							{data?.fileDinhKem?.map((val, index) => {
								return <BoxFile url={val} />;
							})}
						</div>
					)}
				</div>
				<div ref={cardRef}>
					<div className='action flex justify-between '>
						<div className='flex item-canter pointer'>
							<div className='flex'>
								<Tooltip
									placement={'bottom'}
									title={
										<>
											{data?.danhSachDaXem?.length > 0 &&
												_.uniqBy(data?.danhSachDaXem, 'ssoId')?.map((val) => {
													return <div>{val?.hoTen}</div>;
												})}
										</>
									}
								>
									<div className='sum-comment' style={{ color: '#a7abaf', marginRight: 8 }}>
										{data?.soDaXem ?? 0} đã xem
									</div>
								</Tooltip>
								<Tooltip
									placement={'bottom'}
									title={
										<>
											{data?.danhSachBinhLuan?.length > 0 &&
												_.uniqBy(data?.danhSachBinhLuan, 'thongTinNguoiDang.ssoId')?.map((val) => {
													return <div>{val?.thongTinNguoiDang?.hoTen}</div>;
												})}
										</>
									}
								>
									<div className='sum-comment' style={{ color: '#a7abaf' }}>
										{data?.danhSachBinhLuan?.length ?? 0} bình luận
									</div>
								</Tooltip>
							</div>
						</div>
						<div
							className='flex item-canter pointer'
							onClick={() => {
								if (commentRef?.current) {
									//@ts-ignore
									commentRef?.current?.setShowCommend(true);
								}
							}}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='size-6'
								style={{ width: 18, height: 18, marginRight: 6 }}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z'
								/>
							</svg>
							Bình luận
						</div>
					</div>
					<div className='comment-content' style={{ marginTop: 12 }}>
						<Comment idBaiDang={data?._id} ref={commentRef} detail={detail} />
					</div>
				</div>

				{/*{showOption && (*/}
				{/*	<div className='absolute option-them' style={{ top: 25, right: -165 }}>*/}
				{/*		<div className='option-item'>*/}
				{/*			<EditOutlined /> Chỉnh sửa bài viết*/}
				{/*		</div>*/}
				{/*		<div className='option-item'>*/}
				{/*			<DeleteOutlined /> Xoá bài viết*/}
				{/*		</div>*/}
				{/*		<div className='option-item'>*/}
				{/*			<CopyOutlined /> Sao chép liên kết*/}
				{/*		</div>*/}
				{/*		<div className='option-item'>*/}
				{/*			<PushpinOutlined /> Ghim*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*)}*/}
			</div>
		</CardStatusWrapper>
	);
};
export default CardStatus;
