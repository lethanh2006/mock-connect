import type { BaiDang } from '@/services/DienDan/BaiDang/typing';
import { copyToClipboard } from '@/utils/utils';
import {
	CheckCircleOutlined,
	CopyOutlined,
	DeleteOutlined,
	EditOutlined,
	PushpinFilled,
	PushpinOutlined,
} from '@ant-design/icons';
import { Col, message, Popconfirm, Popover, Row, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { history, Link, useModel } from 'umi';
import AvatarBlog from './Avatar';
import BoxFile from './BoxFile';
import Comment from './Comment';

interface IProps {
	handleDoubleClick?: () => void;
	data: BaiDang.IRecord;
	deleteModel: (id: string) => void;
	handleEdit: (data: BaiDang.IRecord) => void;
	handlePin: (pin: boolean) => void;
	detail?: boolean;
	getDataPost?: () => void;
}

const CardStatus = (props: IProps) => {
	const { data, deleteModel, handleEdit, handlePin, detail, getDataPost } = props;
	const { initialState } = useModel('@@initialState');
	const cardRef = useRef(null);
	const commentRef = useRef(null);
	const daXem =
		data?.thongTinNguoiDang?.ssoId === initialState?.currentUser?.ssoId ||
		!!data?.danhSachDaXem?.find((item) => item?.ssoId === initialState?.currentUser?.ssoId);

	const handleClickOutSide = (e: any) => {
		const node = cardRef?.current;
		const { target } = e;
		if (node) {
			//@ts-ignore
			if (!node?.contains(target)) {
				if (commentRef?.current) {
					//@ts-ignore
					commentRef?.current?.setShowCommend(false, e);
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

	const handleRedirectDetail = () => {
		history.push(`${history?.location?.pathname}?idBaiViet=${data?._id}${history?.location?.hash}`);
	};

	const findClosestDate = (arr: BinhLuan.IRecord[]): BinhLuan.IRecord[] => {
		// Get the current time using moment.js
		const now = moment();

		// Initialize the closest element and the minimum difference
		let closestElement = null;
		let minDifference = Infinity;

		// Loop through the array
		for (const element of arr) {
			// Parse the ngayDang to a moment object
			const ngayDangMoment = moment(element?.ngayDang);

			// Calculate the difference in milliseconds
			const difference = Math.abs(now.diff(ngayDangMoment));

			// Check if this difference is smaller than the minimum found so far
			if (difference < minDifference) {
				minDifference = difference;
				closestElement = element;
			}
		}
		if (closestElement) return [closestElement];
		else return [];
	};

	return (
		<>
			<div className='card relative' onDoubleClick={() => handleRedirectDetail()}>
				{!daXem ? (
					<div className='absolute' style={{ top: 0, left: 0 }}>
						<div className='new'>MỚI</div>
					</div>
				) : null}

				<div className='header-card flex justify-between'>
					<div className='user-name flex item-center'>
						<div className='image'>
							<AvatarBlog url={data?.thongTinNguoiDang?.avatar} style={{ width: 42, height: 42 }} />
						</div>
						<div className='thong-tin'>
							<div className='flex item-center'>
								<div className='name'>
									{data?.thongTinNguoiDang?.hoTen}
									{!data?.thongTinNguoiDang?.isGiaoVien ? ` (${data?.thongTinNguoiDang?.ma})` : ''}
								</div>
								{data?.thongTinNguoiDang?.isGiaoVien && (
									<CheckCircleOutlined style={{ color: 'green', marginLeft: 6, marginRight: 6 }} title='Giảng viên' />
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
					<div className='flex item-center' style={{ gap: 12 }}>
						{data?.ghimBaiViet && (
							<div style={{ fontSize: 18, transform: 'rotate(-45deg)' }}>
								<PushpinFilled style={{ color: 'var(--primary-color)' }} />
							</div>
						)}

						{initialState?.currentUser?.ssoId === data?.thongTinNguoiDang?.ssoId && (
							<Popover
								className='popover-post'
								content={
									<>
										<div
											className='option-item'
											style={{ marginBottom: 8, cursor: 'pointer' }}
											onClick={() => handleEdit(data)}
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
											onConfirm={() => deleteModel(data?._id)}
										>
											<div className='option-item text-error' style={{ cursor: 'pointer' }}>
												<DeleteOutlined /> Xoá bài viết
											</div>
										</Popconfirm>
									</>
								}
								placement={'right'}
							>
								<div className='action-menu pointer'>
									<img src='/images/menu.svg' alt='icon' />
								</div>
							</Popover>
						)}
					</div>
				</div>

				<div className='content'>
					<b>{data?.tieuDe ?? ''}</b>

					<div
						className={`${detail ? '' : 'noi-dung-post'}`}
						dangerouslySetInnerHTML={{ __html: data?.noiDung ?? '' }}
					/>
					{!detail && (
						<div style={{ marginTop: 8 }}>
							<Link
								to='#!'
								onClick={(e) => {
									e.preventDefault();
									handleRedirectDetail();
								}}
							>
								Xem thêm
							</Link>
						</div>
					)}

					{typeof data?.fileDinhKem === 'string' ? (
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 8 }}>
							<BoxFile url={data?.fileDinhKem} />
						</div>
					) : (
						<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
							{data?.fileDinhKem?.map((val) => (
								<Col span={24} md={12} key={val}>
									<BoxFile url={val} />
								</Col>
							))}
						</Row>
					)}
				</div>
				<div ref={cardRef}>
					<div className='action flex justify-between '>
						<div className='flex item-canter pointer'>
							<div className='flex'>
								<Tooltip
									placement={'bottom'}
									title={
                    data?.danhSachDaXem?.length > 0 ? (
                      <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                        {data?.danhSachDaXem?.length > 0 &&
                          _.uniqBy(data?.danhSachDaXem, 'ssoId')?.map((val, index) => {
                            if (!detail) {
                              if (index < 10) {
                                return <div key={val.ssoId}>{val?.hoTen}</div>;
                              } else return null;
                            } else {
                              return <div key={val.ssoId}>{val?.hoTen}</div>;
                            }
                          })}
                        {data?.danhSachDaXem?.length > 10 && !detail && (
                          <div>và {data?.danhSachDaXem?.length - 10} người khác</div>
                        )}
                      </div>
                    ) : null
									}
								>
									<div
										className='sum-comment'
										style={{ color: '#a7abaf', marginRight: 8 }}
										onClick={() => {
											handleRedirectDetail();
										}}
									>
										{data?.soDaXem ?? 0} đã xem
									</div>
								</Tooltip>
								<Tooltip
									placement={'bottom'}
									title={
                    data?.danhSachBinhLuan?.length > 0 ? (
                      <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                        {data?.danhSachBinhLuan?.length > 0 &&
                          _.uniqBy(data?.danhSachBinhLuan, 'ssoId')?.map((val, index) => {
                            if (!detail) {
                              if (index < 10) {
                                return <div key={val._id}>{val?.thongTinNguoiDang?.hoTen}</div>;
                              } else return null;
                            } else {
                              return <div key={val._id}>{val?.thongTinNguoiDang?.hoTen}</div>;
                            }
                          })}
                        {data?.danhSachBinhLuan?.length > 10 && !detail && (
                          <div>và {data?.danhSachBinhLuan?.length - 10} người khác</div>
                        )}
                      </div>
                    ) : null
									}
								>
									<div className='sum-comment' style={{ color: '#a7abaf' }} onClick={() => handleRedirectDetail()}>
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
					<div className='content' style={{ paddingBottom: 12 }}>
						<Comment
							idBaiDang={data?._id}
							ref={commentRef}
							detail={detail}
							dataBinhLuan={
								!detail
									? data?.danhSachBinhLuan?.[0]
										? findClosestDate(data?.danhSachBinhLuan)
										: []
									: data?.danhSachBinhLuan
							}
							getDataPost={getDataPost}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default CardStatus;
