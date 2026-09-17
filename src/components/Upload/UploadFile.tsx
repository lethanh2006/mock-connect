import { isAllowedFile, parseAcceptString, validateFileBlob } from '@/utils/fileValidation';
import { getSafeHref } from '@/utils/security';
import { blobToBase64, getNameFile } from '@/utils/utils';
import { IconEye, IconPlus, IconTrash, IconUpload } from '@/components/Icons';
import type { UploadProps } from 'antd';
import { Button, Image, Upload } from 'antd';
import { toast } from '@/utils/toast';
import type { RcFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { useIntl } from 'umi';
import AuthImage from '../Image/AuthImage';
import PreviewFile from '../PreviewFile';
import ModalExpandable from '../Table/ModalExpandable';
import './UploadAvatar.less';
import type { TFileProps, TResizeProps, TUploadProps } from './typing';

const UploadFile: React.FC<TUploadProps> = ({
	value,
	onChange,
	otherProps,
	drag,
	buttonSize,
	buttonDescription,
	accept,
	isAvatar,
	isAvatarSmall,
	maxFileSize = 5,
	maxCount = 1,
	disabled,
	resize,
	fileList: fileListProp,
	extra,
	isLandscapeAvatar,
	hasPreviewFile = true,
	isWidescreen,
	isPrivate,
	...props
}) => {
	const intl = useIntl();
	const isDisabled = disabled || otherProps?.disabled || false;
	const [fileList, setFileList] = useState<any[]>();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const resizeProps: TResizeProps | undefined = typeof resize === 'boolean' ? {} : resize;
	const showImage = isAvatar || isAvatarSmall || isLandscapeAvatar || isWidescreen;
	const { beforeUpload: customBeforeUpload, accept: otherAccept, ...restOtherProps } = otherProps ?? {};
	const acceptString = accept || otherAccept || (showImage ? 'image/*' : '');
	const allowedExtensions = acceptString ? parseAcceptString(acceptString) : [];

	const showFormatError = () => toast.error(intl.formatMessage({ id: 'global.uploadfile.error.format' }));

	const resolveBeforeUpload: UploadProps['beforeUpload'] = async (file, fileList) => {
		if (allowedExtensions.length) {
			if (!isAllowedFile(file, allowedExtensions)) {
				showFormatError();
				return Upload.LIST_IGNORE;
			}
			if (!(await validateFileBlob(file, file.name))) {
				showFormatError();
				return Upload.LIST_IGNORE;
			}
		}
		if (customBeforeUpload) {
			return customBeforeUpload(file, fileList);
		}
		return false;
	};

	const uploadSecurityProps: Pick<UploadProps, 'beforeUpload' | 'accept'> = {
		beforeUpload: resolveBeforeUpload,
		accept: acceptString || undefined,
	};

	useEffect(() => {
		let files: any[] = [];
		const toRemoteFile = (url: string, index?: number) => {
			const safeUrl = getSafeHref(url);
			if (!safeUrl) return null;
			return {
				url: safeUrl,
				remote: true,
				name: props.previewFileProps?.isFileId
					? `Tập tin${index !== undefined ? ` ${index + 1}` : ''}`
					: getNameFile(safeUrl),
			};
		};
		// Single URL
		if (typeof value === 'string') {
			const file = toRemoteFile(value);
			files = file ? [file] : [];
			setFileList(files);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: files });
		}
		// Array of URLs
		else if (Array.isArray(value)) {
			files = value
				.map((url, ind) => (typeof url === 'string' ? toRemoteFile(url, ind) : null))
				.filter(Boolean) as any[];
			setFileList(files);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: files });
		}
		// Object of antd file upload
		else {
			files = fileListProp || (value && value.fileList) || [];
			setFileList(files);
		}
	}, [value, fileListProp]);

	/** Resize Hình ảnh */
	const resizeImages = (files: TFileProps[]): TFileProps[] => {
		let res = files;
		try {
			res = files?.map((file) => {
				const type = file.type?.split('/'); // image/jpeg
				if (type?.[0] === 'image' && !file.resized) {
					file.resized = true;
					Resizer.imageFileResizer(
						file.originFileObj as any,
						resizeProps?.maxWidth ?? 1024,
						resizeProps?.maxHeight ?? 1024,
						resizeProps?.compressFormat ?? type?.[1] ?? 'webp',
						resizeProps?.quality ?? 90,
						resizeProps?.rotation ?? 0,
						(blob: any) => {
							// temp = [{ url: URL.createObjectURL(blob), remote: true, name: getNameFile(URL.createObjectURL(blob)) }];
							// console.log('🚀 ~ useEffect ~ temp:', temp);
							file.originFileObj = blob;
						},
						resizeProps?.outputType ?? 'file',
						resizeProps?.minWidth,
						resizeProps?.minHeight,
					);
				}
				return file;
			});
		} catch (err) {
			console.log(err);
		}
		return res;
	};

	const handleChange = (val: any) => {
		let files = val.fileList as TFileProps[];
		const findLargeFile = files?.some((file) => file.size && file.size / 1024 / 1024 > maxFileSize);
		if (findLargeFile) {
			toast.error(intl.formatMessage({ id: 'global.uploadfile.error.mb' }, { maxFileSize: maxFileSize }));
			return;
		}

		const findWrongTypeFile = files?.some(
			(file) => file?.remote !== true && allowedExtensions.length > 0 && !isAllowedFile(file, allowedExtensions),
		);
		if (findWrongTypeFile) {
			toast.error(intl.formatMessage({ id: 'global.uploadfile.error.format' }));
			return;
		}

		if (files.length > maxCount) files.splice(0, files.length - maxCount);
		if (!!resize) files = resizeImages(files);

		setFileList(files);
		if (onChange) onChange({ fileList: files });
	};

	/** Xem trước ảnh */
	const handlePreviewImage = async (file: TFileProps) => {
		// Nếu file mới up lên (chưa có url và preview) thì thêm preview vào file
		if (!file.url && !file.preview) file.preview = await blobToBase64(file.originFileObj as RcFile);

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	/** Xem trước file */
	const handlePreviewFile = async (file: TFileProps) => {
		const safeUrl = getSafeHref(file.url);
		if (safeUrl) {
			setPreviewImage(safeUrl);
			setPreviewOpen(true);
		}
	};

	const Extra = () =>
		isDisabled ? null : (
			<small style={{ color: '#999' }}>
				<i>{intl.formatMessage({ id: 'global.uploadfile.toida' }, { maxCount: maxCount, maxFileSize: maxFileSize })}</i>
				{extra && (
					<div>
						<i>{extra}</i>
					</div>
				)}
			</small>
		);

	// DRAGGER
	if (drag)
		return (
			<Upload.Dragger
				disabled={isDisabled}
				customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={maxCount > 1}
				{...restOtherProps}
				{...uploadSecurityProps}
			>
				{!isDisabled ? (
					<>
						<p
							className='ant-upload-drag-icon'
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: '100%',
								marginBottom: 16,
								color: 'var(--vin-color-primary, #c72127)',
							}}
						>
							<IconUpload size={48} style={{ color: 'inherit' }} />
						</p>
						<p className='ant-upload-text'>{intl.formatMessage({ id: 'global.uploadfile.text' })}</p>
						<p className='ant-upload-hint'>{buttonDescription}</p>
						<Extra />
					</>
				) : null}
			</Upload.Dragger>
		);

	if (showImage)
		return (
			<>
				<Upload
					disabled={isDisabled}
					customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
					listType='picture-card'
					className={`avatar-uploader ${
						isAvatarSmall
							? 'avatar-small'
							: isLandscapeAvatar
								? 'avatar-landscape'
								: isWidescreen
									? 'avatar-widescreen'
									: undefined
					}`}
					fileList={fileList}
					onChange={handleChange}
					style={{ width: '100%' }}
					multiple={false}
					accept='image/*'
					onPreview={handlePreviewImage}
					itemRender={
						isPrivate
							? (originNode, file, currFileList, actions) => {
									if (file.url || file.preview) {
										return (
											<div
												className='ant-upload-item-custom'
												style={{ position: 'relative', width: '100%', height: '100%' }}
											>
												<AuthImage
													src={file.url || file.preview}
													style={{ width: '100%', height: '100%', objectFit: 'cover' }}
												/>

												{!isDisabled && (
													<div className='ant-upload-list-item-actions-custom'>
														<span onClick={() => handlePreviewImage(file)}>
															<IconEye size={18} style={{ color: '#fff', marginRight: 12 }} />
														</span>
														<span onClick={() => actions.remove()}>
															<IconTrash size={18} style={{ color: '#fff' }} />
														</span>
													</div>
												)}
											</div>
										);
									}
									return originNode;
								}
							: undefined
					}
					{...restOtherProps}
					{...uploadSecurityProps}
				>
					{!isDisabled && !fileList?.length ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<IconPlus size={20} />
							<div className='ant-upload-text'>
								{buttonDescription || intl.formatMessage({ id: 'global.uploadfile.text1' })}
							</div>
						</div>
					) : null}
				</Upload>
				<Extra />

				{isPrivate ? (
					<AuthImage
						isDetail
						src={previewImage}
						style={{ display: 'none' }}
						preview={{
							visible: previewOpen,
							onVisibleChange: (val: boolean) => setPreviewOpen(val),
						}}
					/>
				) : (
					<Image
						style={{ display: 'none' }}
						preview={{
							visible: previewOpen,
							src: previewImage,
							onVisibleChange: (val) => setPreviewOpen(val),
						}}
					/>
				)}
			</>
		);

	// UPLOAD BUTTON
	return (
		<>
			<Upload
				disabled={isDisabled}
				customRequest={({ onSuccess }) => {
					setTimeout(() => onSuccess && onSuccess('ok'), 0);
				}}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={maxCount > 1}
				onPreview={hasPreviewFile ? handlePreviewFile : undefined}
				{...restOtherProps}
				{...uploadSecurityProps}
			>
				{!isDisabled ? (
					<Button size={buttonSize || 'small'} icon={<IconUpload />}>
						{buttonDescription || intl.formatMessage({ id: 'global.uploadfile.button.chontep' }, { maxFileSize })}
					</Button>
				) : null}
			</Upload>
			<Extra />

			{hasPreviewFile && (
				<ModalExpandable
					title='Xem trước tập tin'
					width={1200}
					open={previewOpen}
					footer={null}
					onCancel={() => setPreviewOpen(false)}
				>
					<PreviewFile file={previewImage} {...props.previewFileProps} isPrivate={isPrivate} />

					<div className='form-footer'>
						<Button onClick={() => setPreviewOpen(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				</ModalExpandable>
			)}
		</>
	);
};

export default UploadFile;
