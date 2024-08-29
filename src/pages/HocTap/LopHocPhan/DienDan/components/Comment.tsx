import styled from 'styled-components';
import { Form, Popover } from 'antd';
import TinyEditor from '@/components/TinyEditor';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import AvatarBlog from './Avatar';
import BoxFile from './BoxFile';

const CommendWrapper = styled.div`
	.comment-box {
		margin-top: 20px;

		.image {
			//width: 32px;
			//height: 32px;
			margin-right: 8px;
			//overflow: hidden;
			//border-radius: 50%;
		}

		.fake-input {
			display: flex;
			align-items: center;
			width: 100%;
			height: 40px;
			padding: 0 12px;
			background: rgba(136, 136, 136, 0.14);
			border-radius: 12px;
			cursor: pointer;
		}
	}

	.list-comment {
		.image {
			//width: 42px;
			//height: 42px;
			margin-right: 8px;
			//overflow: hidden;
			//border-radius: 50%;
		}

		.comment-user {
			padding: 8px;
			overflow: hidden;
			background: rgba(136, 136, 136, 0.14);
			border-radius: 8px;
		}
	}

	.item-comment {
		.icon-action {
			display: none;
		}

		.time-comment {
			display: none;
		}

		&:hover {
			.icon-action {
				display: block;
			}

			.time-comment {
				display: block;
			}
		}
	}

	.option-item {
		margin-bottom: 8px;
		cursor: pointer;

		&:last-of-type {
			margin-bottom: 0;
		}
	}
`;

interface IProps {
	idBaiDang: string;
	detail?: boolean;
}

const Comment = React.forwardRef((props: IProps, ref) => {
	const { idBaiDang, detail } = props;
	const {
		getModel: getDanhSachBinhLuan,
		postModel,
		deleteModel,
		putModel,
		handleEdit,
		edit,
		record,
		setEdit,
		setRecord,
	} = useModel('diendan.binhluan');
	const [form] = Form.useForm();
	const [showComment, setShowCommend] = useState<boolean>(false);
	const cardRef = useRef(null);
	const [danhSachComment, setDanhSachComment] = useState<BinhLuan.IRecord[]>([]);
	const { record: recNhanSu } = useModel('sinhvien.sinhvien');

	useImperativeHandle(ref, () => ({
		setShowCommend: (data: boolean) => {
			setShowCommend(data);
		},
	}));

	const getData = async () => {
		getDanhSachBinhLuan({ baiDangId: idBaiDang }).then((res) => {
			if (!detail) {
				if (res?.[0]) setDanhSachComment([res?.[0]]);
				else setDanhSachComment([]);
			} else {
				setDanhSachComment(res);
			}
		});
	};

	const onFinish = async (values: any) => {
		try {
			if (!values?.noiDung) {
				return;
			}
			const fileDinhKem = await buildUpLoadMultiFile(values, 'fileDinhKem');
			const payload = {
				...values,
				baiDangId: idBaiDang,
				fileDinhKem: fileDinhKem,
				// ngayDang: moment().toISOString(),
			};
			if (edit) {
				putModel(record?._id ?? '', { ...payload }, () => {
					getData();
					form.resetFields();
					setShowCommend(false);
				});
			} else {
				postModel({ ...payload }, () => {
					getData();
					form.resetFields();
					setShowCommend(false);
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handeClickOutSide = (e: any) => {
		const { target } = e;
		const node = cardRef?.current;
		if (node) {
			//@ts-ignore
			if (!node?.contains(target)) {
				if (form.getFieldValue('noiDung') === '' || !form.getFieldValue('noiDung')) {
					// setShowCommend(false);
				}
			}
		}
	};

	useEffect(() => {
		document.addEventListener('click', handeClickOutSide);
		return () => {
			document.removeEventListener('click', handeClickOutSide);
		};
	}, []);

	useEffect(() => {
		if (idBaiDang) getData();
	}, [idBaiDang]);

	console.log('danhSachComment', danhSachComment);

	return (
		<CommendWrapper>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: 8 }}>
				{danhSachComment?.length > 0 &&
					danhSachComment?.map((val) => {
						return (
							<div className='item-comment flex item-center relative'>
								<div className='list-comment flex'>
									<div className='image' style={{ flexShrink: 0 }}>
										<AvatarBlog url={val?.thongTinNguoiDang?.avatar} style={{ width: 32, height: 32 }} />
									</div>
									<div>
										<div className='comment-user'>
											<div className='flex item-center'>
												<div className='flex item-center'>
													<b>{val?.thongTinNguoiDang?.hoTen ?? 'Không xác định'} </b>{' '}
													{val?.thongTinNguoiDang?.isGiaoVien && (
														<CheckCircleOutlined style={{ color: 'green', marginLeft: 6 }} />
													)}
												</div>
												<span style={{ fontSize: 11, color: 'rgba(68,68,68,0.84)', marginLeft: 6 }}>
													{moment(val?.ngayDang).calendar()}
												</span>
											</div>
											<div dangerouslySetInnerHTML={{ __html: val?.noiDung ?? '' }}></div>
											{typeof val?.fileDinhKem !== 'string' && val?.fileDinhKem && val?.fileDinhKem?.length > 0 && (
												<div
													style={{
														display: 'grid',
														gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
														gap: 12,
														marginTop: 8,
													}}
												>
													{val?.fileDinhKem?.map((value) => (
														<BoxFile url={value} />
													))}
												</div>
											)}
										</div>
										{/*{val?.ngayDang && (*/}
										{/*	<div className='time-comment' style={{ fontSize: 11, marginTop: 4 }}>*/}
										{/*		{moment(val?.ngayDang).calendar()}*/}
										{/*	</div>*/}
										{/*)}*/}
									</div>
								</div>

								<Popover
									placement={'right'}
									content={
										<>
											<div>
												<div
													className='option-item'
													style={{ marginBottom: 8, cursor: 'pointer' }}
													onClick={() => {
														setShowCommend(true);
														handleEdit(val);
														form.setFieldsValue({ ...val });
													}}
												>
													<EditOutlined /> Chỉnh sửa
												</div>
												<div
													className='option-item'
													style={{ cursor: 'pointer' }}
													onClick={() => {
														deleteModel(val?._id, getData);
													}}
												>
													<DeleteOutlined /> Xoá
												</div>
											</div>
										</>
									}
								>
									<div className='pointer icon-action'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											strokeWidth={1.5}
											stroke='currentColor'
											className='size-6'
											style={{ width: '30px', height: '20px' }}
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
											/>
										</svg>
									</div>
								</Popover>
							</div>
						);
					})}
			</div>

			<div ref={cardRef} className='comment-box'>
				<Form form={form} onFinish={onFinish}>
					<div className={`flex ${showComment ? '' : 'item-center'}`}>
						<div className='image' style={{ flexShrink: 0 }}>
							<AvatarBlog url={recNhanSu?.anhDaiDienUrl ?? ''} style={{ width: 32, height: 32 }} />
						</div>
						{showComment ? (
							<div style={{ width: '100%' }}>
								<div style={{ width: '100%' }}>
									<Form.Item style={{ width: '100%', marginBottom: 8 }} name='noiDung'>
										<TinyEditor tinyToolbar hideMenubar />
									</Form.Item>
								</div>
								<Form.Item style={{ marginBottom: 0 }} name={'fileDinhKem'}>
									<UploadFile
										otherProps={{ multiple: true }}
										buttonDescription={'Thêm tập tin đính kèm'}
										accept={'.png, .jpg, .pdf, .docx, .xlsx'}
										maxCount={5}
									/>
								</Form.Item>
							</div>
						) : (
							<div
								className='fake-input'
								onClick={() => {
									setShowCommend(true);
									setEdit(false);
									setRecord(undefined);
								}}
							>
								Trả lời dưới tên {recNhanSu?.ten ?? ''}
							</div>
						)}

						{/*<div className='pointer' style={{ flexShrink: 0, color: '#000000' }}>*/}
						{/*	<svg*/}
						{/*		xmlns='http://www.w3.org/2000/svg'*/}
						{/*		fill='none'*/}
						{/*		viewBox='0 0 24 24'*/}
						{/*		strokeWidth={1.5}*/}
						{/*		stroke='currentColor'*/}
						{/*		className='size-6'*/}
						{/*		style={{ width: 24, height: 24, marginLeft: 12 }}*/}
						{/*	>*/}
						{/*		<path*/}
						{/*			strokeLinecap='round'*/}
						{/*			strokeLinejoin='round'*/}
						{/*			d='m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13'*/}
						{/*		/>*/}
						{/*	</svg>*/}
						{/*</div>*/}

						<svg
							onClick={() => {
								form.submit();
							}}
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'
							style={{ width: 24, height: 24, marginLeft: 12, color: '#007EB9', flexShrink: 0, cursor: 'pointer' }}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
							/>
						</svg>
					</div>
				</Form>
			</div>
		</CommendWrapper>
	);
});
export default Comment;
