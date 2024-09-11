import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Input, Popconfirm, Popover } from 'antd';
import moment from 'moment';
import { nanoid } from 'nanoid';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import AvatarBlog from './Avatar';

interface IProps {
	idBaiDang: string;
	detail?: boolean;
	dataBinhLuan?: BinhLuan.IRecord[];
	getDataPost?: () => void;
}

const Comment = React.forwardRef((props: IProps, ref) => {
	const { idBaiDang, detail, dataBinhLuan, getDataPost } = props;
	const { postModel, deleteModel, putModel, handleEdit, edit, record, setEdit, setRecord } =
		useModel('diendan.binhluan');
	const [form] = Form.useForm();
	const [showComment, setShowCommend] = useState<boolean>(false);
	const [showCommentEdit, setShowCommendEdit] = useState<boolean>(false);
	const cardRef = useRef(null);
	const actionCommentRef = useRef(null);
	const [danhSachComment, setDanhSachComment] = useState<BinhLuan.IRecord[]>([]);
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	useImperativeHandle(ref, () => ({
		setShowCommend: (data: boolean, e?: any) => {
			if (e) {
				const { target } = e;
				if (actionCommentRef?.current) {
					if (form.getFieldValue('noiDung') === '' || !form.getFieldValue('noiDung')) {
						//@ts-ignore
						if (!actionCommentRef?.current?.contains(target)) {
							setShowCommend(data);
							setShowCommendEdit(false);
							setEdit(false);
							setRecord(undefined);
						} else {
							setShowCommend(data);
						}
					} else {
						setShowCommend(data);
					}
				} else {
					setShowCommend(data);
				}
			} else {
				setShowCommend(data);
			}
		},
	}));

	const getData = async () => {
		if (getDataPost) getDataPost();
		// getDanhSachBinhLuan({ baiDangId: idBaiDang }).then((res) => {
		// 	if (!detail) {
		// 		if (res?.[0]) setDanhSachComment([res?.[0]]);
		// 		else setDanhSachComment([]);
		// 	} else {
		// 		setDanhSachComment(res);
		// 	}
		// });
	};

	const onFinish = async (values: any) => {
		try {
			const dataComment = [...danhSachComment];
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
					// getData();
					dataComment?.forEach((item, index) => {
						if (item?._id === record?._id) {
							dataComment?.splice(index, 1, { ...record, ...payload });
						}
					});
					form.resetFields();
					setShowCommend(false);
					setShowCommendEdit(false);
				});
			} else {
				postModel({ ...payload }, () => {
					// getData();
					dataComment?.unshift({
						...payload,
						_id: nanoid(),
						thongTinNguoiDang: {
							hoTen: recSinhVien?.ten,
							avatar: recSinhVien?.anhDaiDienUrl,
							ssoId: recSinhVien?.ssoId,
							isGiaoVien: true,
						},
					});
					form.resetFields();
					setShowCommend(false);
					setShowCommendEdit(false);
				});
			}
			setDanhSachComment(dataComment);
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
		// if (idBaiDang) getData();
	}, [idBaiDang]);

	useEffect(() => {
		if (dataBinhLuan) setDanhSachComment(dataBinhLuan);
	}, [dataBinhLuan]);

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
				gap: 8,
			}}
		>
			{danhSachComment?.length
				? danhSachComment?.map((val) => (
						<div className='item-comment flex item-center relative' key={val._id}>
							<div className='list-comment flex'>
								<div className='image' style={{ flexShrink: 0 }}>
									<AvatarBlog url={val?.thongTinNguoiDang?.avatar} style={{ width: 32, height: 32 }} />
								</div>
								<div>
									<div className='comment-user'>
										<div className='flex item-center wrap'>
											<div className='flex item-center'>
												<b>
													{val?.thongTinNguoiDang?.hoTen ?? 'Không xác định'}{' '}
													{!val?.thongTinNguoiDang?.isGiaoVien ? ` (${val?.thongTinNguoiDang?.ma})` : ''}
												</b>{' '}
												{val?.thongTinNguoiDang?.isGiaoVien && (
													<CheckCircleOutlined style={{ color: 'green', marginLeft: 6 }} title='Giảng viên' />
												)}
											</div>
											<span style={{ fontSize: 11, color: 'rgba(68,68,68,0.84)', marginLeft: 6 }}>
												{moment(val?.ngayDang).calendar()}
											</span>
										</div>
										<div dangerouslySetInnerHTML={{ __html: (val?.noiDung ?? '')?.replace(/\n/g, '<br/>') }} />
										{/*{typeof val?.fileDinhKem !== 'string' && val?.fileDinhKem && val?.fileDinhKem?.length > 0 && (*/}
										{/*	<div*/}
										{/*		style={{*/}
										{/*			display: 'grid',*/}
										{/*			gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',*/}
										{/*			gap: 12,*/}
										{/*			marginTop: 8,*/}
										{/*		}}*/}
										{/*	>*/}
										{/*		{val?.fileDinhKem?.map((value) => (*/}
										{/*			<BoxFile url={value} />*/}
										{/*		))}*/}
										{/*	</div>*/}
										{/*)}*/}
									</div>
									{/*{val?.ngayDang && (*/}
									{/*	<div className='time-comment' style={{ fontSize: 11, marginTop: 4 }}>*/}
									{/*		{moment(val?.ngayDang).calendar()}*/}
									{/*	</div>*/}
									{/*)}*/}
								</div>
							</div>

							{recSinhVien?.ssoId === val?.thongTinNguoiDang?.ssoId && (
								<Popover
									placement={'right'}
									content={
										<>
											<div
												ref={actionCommentRef}
												className='option-item'
												style={{ marginBottom: 8, cursor: 'pointer' }}
												onClick={() => {
													setShowCommend(true);
													setShowCommendEdit(true);
													handleEdit(val);
													form.setFieldsValue({ ...val });
												}}
											>
												<EditOutlined /> Chỉnh sửa
											</div>

											<Popconfirm
												title={'Bạn có chắc muốn xoá bình luận này?'}
												onConfirm={() => {
													const dataComment = [...danhSachComment];
													setDanhSachComment(dataComment?.filter((item) => item?._id !== val?._id));
													deleteModel(val?._id, () => {});
												}}
											>
												<div className='option-item text-error' style={{ cursor: 'pointer' }}>
													<DeleteOutlined /> Xóa
												</div>
											</Popconfirm>
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
							)}
						</div>
				  ))
				: null}

			<div ref={cardRef} className='comment-box'>
				<Form form={form} onFinish={onFinish}>
					<div className={`flex ${showComment ? '' : 'item-center'}`}>
						<div className='image' style={{ flexShrink: 0 }}>
							<AvatarBlog url={recSinhVien?.anhDaiDienUrl ?? ''} style={{ width: 32, height: 32 }} />
						</div>
						{showComment || showCommentEdit ? (
							<div style={{ width: '100%' }}>
								<div style={{ width: '100%' }}>
									<Form.Item name='noiDung' noStyle>
										{/*<TinyEditor tinyToolbar hideMenubar />*/}
										<Input.TextArea autoFocus placeholder={`Trả lời dưới tên ${recSinhVien?.ten ?? ''}`} />
									</Form.Item>
								</div>
								{/*<Form.Item style={{ marginBottom: 0 }} name={'fileDinhKem'}>*/}
								{/*	<UploadFile*/}
								{/*		otherProps={{ multiple: true }}*/}
								{/*		buttonDescription={'Thêm tập tin đính kèm'}*/}
								{/*		accept={'.png, .jpg, .pdf, .docx, .xlsx'}*/}
								{/*		maxCount={5}*/}
								{/*	/>*/}
								{/*</Form.Item>*/}
							</div>
						) : (
							<div
								className='fake-input'
								onClick={() => {
									setEdit(false);
									setRecord(undefined);
									setShowCommend(true);
								}}
							>
								Trả lời dưới tên {recSinhVien?.ten ?? ''}
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
							onClick={() => form.submit()}
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'
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
					</div>
				</Form>
			</div>
		</div>
	);
});
export default Comment;
